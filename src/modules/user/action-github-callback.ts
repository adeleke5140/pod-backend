import { StatusCodes } from 'http-status-codes';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';
import { BaseValidationType, reqValidationResult } from '../../util/validator';
import { HttpError } from '../../util/http-error';
import { httpClient } from '../../util/http-client';
import { IUserModel, userModel } from './user.model';
import jwt, { SignOptions } from 'jsonwebtoken';
import { appConfig } from '../../config/env';

interface IReq extends IAppRequest {
  body: {
    code: string;
  };
}

interface IRes extends IAppResponse {
  json: any;
}
export const validateGithubCallbackAction: BaseValidationType = [reqValidationResult];

const clientID = 'f60f190806923e18f3ed';
const clientSecret = '630beb018ffb9cb4364029fbd94e7781d7f25624';
export async function githubCallbackAction(req: IReq, res: IRes): Promise<IRes> {
  const { code } = req.body;
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
      // register if not registered
      const {
        login: username,
        name: fullname,
        email,
        twitter_username: twitter,
      } = githubUserData.data;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let user: IUserModel = await userModel.findOne({ username }).lean();
      // let user: IUserModel;
      if (!user) {
        // Throw exception if user already exists
        const userData: Partial<IUserModel> = {
          email,
          fullname,
          username,
          twitter,
          accessToken,
          isEnabled: true,
        };
        user = await userModel.create(userData);
      }

      const token: string = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          createdAt: user.createdAt,
          isEnabled: user.isEnabled,
          fullname: user.fullname,
          email: user.email,
        } as Partial<IUserModel>,
        appConfig.jwtSecret,
        {
          expiresIn: '1y', //appConfig.jwtExpInDays
        } as SignOptions,
      );

      return res.json({
        success: true,
        data: { token, userId: user._id, user },
      });
    }

    return res.json({ success: false, message: 'Unable to authenticate user' });
  } catch (e) {
    console.log('error', e);
    throw new HttpError(StatusCodes.SERVICE_UNAVAILABLE);
  }
}
