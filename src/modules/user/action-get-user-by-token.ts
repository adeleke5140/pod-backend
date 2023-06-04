import jwt from 'jsonwebtoken';

import { BaseValidationType, reqValidationResult } from '../../util/validator';
import { IAppResponse } from '../../types/app-response';
import { IAppRequest } from '../../types/app-request';
import { HttpError } from '../../util/http-error';
import { StatusCodes } from 'http-status-codes';
import { appConfig } from '../../config/env';
import { IUserModel, userModel } from './user.model';
import { body } from 'express-validator';

interface IReq extends IAppRequest {
  body: any;
}

interface IRes extends IAppResponse {
  json: (body: any) => this;
}

export const validateGetUserByToken: BaseValidationType = [
  body('token').exists().trim(),
  reqValidationResult,
];

export async function getUserByTokenAction(req: IReq, res: IRes): Promise<IRes> {
  const { token } = req.body;

  let decodedToken: any;

  try {
    decodedToken = jwt.verify(token, appConfig.jwtSecret);
  } catch (error) {
    console.log('error', error);
    throw new HttpError(StatusCodes.UNAUTHORIZED);
  }
  const { _id: userIdToken } = decodedToken ?? {};

  const user: IUserModel = await userModel.findOne({
    _id: userIdToken,
    isEnabled: true,
  });
  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }
  return res.json(user);
}
