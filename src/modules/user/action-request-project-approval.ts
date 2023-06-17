import { StatusCodes } from 'http-status-codes';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';
import { BaseValidationType, reqValidationResult } from '../../util/validator';
import { HttpError } from '../../util/http-error';
import { httpClient } from '../../util/http-client';
import { IUserModel, userModel } from './user.model';
import { appConfig } from '../../config/env';
import PoDJosn from '../../abis/PoDNFT.sol/PoDNFT.json';
import { ethers } from 'ethers';
import { PoDNFT } from 'types/PoDNFT';
import { IProjectModel, projectModel } from './project.model';

const message = 'I want to allow contributors to mint NFTs for my project:';
interface IReq extends IAppRequest {
  body: {
    projectName: string; // case senstive
    signature: string;
    nftUri: string;
    twitter?: string;
    minContributions: number;
  };
}

interface IRes extends IAppResponse {
  json: any;
}

export const validateRequestProjectApprovalAction: BaseValidationType = [reqValidationResult];

export async function requestProjectApproval(req: IReq, res: IRes): Promise<IRes> {
  const { projectName, signature, nftUri, minContributions = 1, twitter } = req.body;

  const userId = req.userId;

  const user: IUserModel = await userModel.findOne({
    _id: userId,
    isEnabled: true,
  });

  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  try {
    // get user repos
    const userReposResponse = await httpClient.httpGET({
      url: `https://api.github.com/users/${user.username}/repos`,
      headers: {
        accept: 'application/json',
        Authorization: 'token ' + user.accessToken,
      },
    });

    const userRepos = userReposResponse?.data;
    // filter out the forks from public repos
    const noForkRepos: Array<any> = userRepos?.filter(
      (repo: Record<string, any>) => repo?.fork === false,
    );

    const matchedRepo = noForkRepos
      .map((repo: any) => {
        return {
          name: repo.name,
          link: repo.html_url,
          isForked: repo.fork,
          description: repo.description,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          stargazersCount: repo.stargazers_count,
          watchersCount: repo.watchers_count,
          forks: repo.forks,
        };
      })
      .filter((repo: any) => {
        return repo.name == projectName;
      });

    // no approval for now
    if (matchedRepo.length == 1) {
      // TODO
      const verifySignature = ethers.utils.verifyMessage(`${message}:${projectName}`, signature);

      const provider = new ethers.providers.JsonRpcProvider(appConfig.web3Rpc);
      const walletWithProvider = new ethers.Wallet(appConfig.privateKey, provider);
      const podContract: PoDNFT = new ethers.Contract(
        appConfig.contractAddr.podNft,
        PoDJosn.abi,
        provider,
      ) as PoDNFT;
      const projectHash = ethers.utils.hashMessage(projectName);

      // TODO
      // if (ethers.constants.AddressZero != (await podContract.approvedProjectOwners(projectHash))) {
      //   return res.json({
      //     success: false,
      //     data: {},
      //     message: 'Project already registered',
      //   });
      // }

      try {
        const createProject = await podContract
          .connect(walletWithProvider)
          .approveProject(projectHash, verifySignature);
        //const tx = await createProject.wait();

        try {
          const projectData: Partial<IProjectModel> = {
            username: user.username,
            projectHash,
            projectName,
            nftUri,
            twitter,
            minContributions,
            account: verifySignature,
          };
          const project = await projectModel.create(projectData);

          if (project) {
            return res.json({
              success: true,
              data: { projectHash, trasactionHash: createProject.hash },
              message: 'Project registered and ready to mint NFTs',
            });
          }
        } catch (e) {
          console.log('error:', e);
          return res.json({
            success: false,
            data: {},
            message: 'Duplicate minting not allowed.',
          });
        }
      } catch (e) {
        console.log('error:', e);
        return res.json({
          success: false,
          data: {},
          message: 'Fail to approve project on chain',
        });
      }
    }
  } catch (e) {
    console.log('error', e);
  }

  return res.json({
    success: false,
    message: `Fail to validate repository ownership for user ${user.username}`,
  });
}
