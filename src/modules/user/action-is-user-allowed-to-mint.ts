import { StatusCodes } from 'http-status-codes';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';
import { BaseValidationType, reqValidationResult } from '../../util/validator';
import { HttpError } from '../../util/http-error';
import { httpClient } from '../../util/http-client';
import { appConfig } from '../../config/env';
import { IProjectModel, projectModel } from './project.model';
import { ethers } from 'ethers';
import PoDJosn from '../../abis/PoDNFT.sol/PoDNFT.json';
import { PoDNFT } from 'types/PoDNFT';

interface IReq extends IAppRequest {
  body: {
    code: string;
    projectName?: string;
    projectHash: string;
    account: string;
  };
}

interface IRes extends IAppResponse {
  json: any;
}
export const validateIsUserAllowedToMintNftAction: BaseValidationType = [reqValidationResult];

const clientID = 'f60f190806923e18f3ed';
const clientSecret = '630beb018ffb9cb4364029fbd94e7781d7f25624';
export async function isUserAllowedToMintAction(req: IReq, res: IRes): Promise<IRes> {
  const { code, projectHash, account } = req.body;
  const url = `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`;

  try {
    const githubResponse = await httpClient
      .httpPOST({
        url,
        headers: {
          accept: 'application/json',
        },
      })
      .catch((e) => {
        console.log('login/oauth/access_token error', e);
      });

    // console.log('githubResponse response is ', githubResponse.data);

    const accessToken = githubResponse.data.access_token;
    const githubUserData = await httpClient.httpGET({
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: 'token ' + accessToken,
      },
    });

    // console.log(`githubUserData`, githubUserData.data);

    const githubUsername = githubUserData.data?.login;
    if (githubUsername != null) {
      const { login: contributorUsername } = githubUserData.data;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // let user: IUserModel = await userModel.findOne({ username }).lean();
      // // let user: IUserModel;
      // if (!user) {
      //   // Throw exception if user already exists
      //   const userData: Partial<IUserModel> = {
      //     email,
      //     fullname,
      //     username,
      //     twitter,
      //     accessToken,
      //     isEnabled: true,
      //   };
      //   user = await userModel.create(userData);
      // }

      // const token: string = jwt.sign(
      //   {
      //     _id: user._id,
      //     username: user.username,
      //     createdAt: user.createdAt,
      //     isEnabled: user.isEnabled,
      //     fullname: user.fullname,
      //     email: user.email,
      //   } as Partial<IUserModel>,
      //   appConfig.jwtSecret,
      //   {
      //     expiresIn: '1y', //appConfig.jwtExpInDays
      //   } as SignOptions,
      // );

      // validate if contributed to project

      const projectDetails: IProjectModel = await projectModel
        .findOne({ projectHash: projectHash })
        .lean();

      const { projectName, username: owner, minContributions, nftUri } = projectDetails;

      const projectContributors = await httpClient.httpGET({
        url: `https://api.github.com/repos/${owner}/${projectName}/contributors?q=contributions&order=desc`,
        headers: {
          accept: 'application/json',
        },
      });

      const userContributor = projectContributors.data.filter((user: any) => {
        return user.login == contributorUsername;
      });

      if (userContributor.length != 1) {
        return res.json({
          success: true,
          data: { isAllowedToMint: false, reason: 'Not a contributor' },
        });
      }

      if (userContributor[0].contributions < minContributions) {
        return res.json({
          success: true,
          data: { isAllowedToMint: false, reason: 'Min contributions criteria not met' },
        });
      }

      const provider = new ethers.providers.JsonRpcProvider(appConfig.web3Rpc);
      const walletWithProvider = new ethers.Wallet(appConfig.privateKey, provider);
      const podContract: PoDNFT = new ethers.Contract(
        appConfig.contractAddr.podNft,
        PoDJosn.abi,
        provider,
      ) as PoDNFT;

      try {
        const mintNft = await podContract
          .connect(walletWithProvider)
          .safeMint(account, projectHash, nftUri);
        if (mintNft.hash) {
          return res.json({
            success: true,
            data: { isAllowedToMint: true, transactionHash: mintNft.hash },
          });
        }
      } catch (e) {
        console.log('error', e);
      }
      return res.json({
        success: false,
        message: 'Fail to mint NFT',
      });
    }

    return res.json({ success: false, message: 'Unable to authenticate user' });
  } catch (e) {
    console.log('error', e);
    throw new HttpError(StatusCodes.SERVICE_UNAVAILABLE);
  }
}
