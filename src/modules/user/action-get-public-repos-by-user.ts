import { StatusCodes } from 'http-status-codes';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';
import { BaseValidationType, reqValidationResult } from '../../util/validator';
import { HttpError } from '../../util/http-error';
import { httpClient } from '../../util/http-client';
import { IUserModel, userModel } from './user.model';
import { appConfig } from '../../config/env';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

interface IReq extends IAppRequest {
  body: {
    token: string;
  };
}

interface IRes extends IAppResponse {
  json: any;
}

export const validateGetPublicReposByUserAction: BaseValidationType = [
  body('token').exists().trim(),
  reqValidationResult,
];

const clientID = 'f60f190806923e18f3ed';
const clientSecret = '630beb018ffb9cb4364029fbd94e7781d7f25624';
export async function getPublicReposByUserAction(req: IReq, res: IRes): Promise<IRes> {
  const { token } = req.body;

  let decodedToken: any;

  try {
    decodedToken = jwt.verify(token, appConfig.jwtSecret);
  } catch (error) {
    throw new HttpError(StatusCodes.UNAUTHORIZED);
  }
  const { _id: userId } = decodedToken ?? {};

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
    // console.log(`userRepos===>`, userReposResponse.data?.length);

    const userRepos = userReposResponse?.data;
    // filter out the forks from public repos
    const noForkRepos = userRepos?.filter((repo: Record<string, any>) => repo?.fork === false);

    const publicRepos = noForkRepos.map((repo: any) => {
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
    });

    // TODO pagination
    return res.json({
      success: true,
      data: { user, publicRepos },
    });
  } catch (e) {
    console.log('error', e);
    throw new HttpError(StatusCodes.SERVICE_UNAVAILABLE);
  }
}
