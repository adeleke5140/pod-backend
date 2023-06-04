import jwt from 'jsonwebtoken';
import { appConfig } from '../env';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';
import { NextFunction } from 'express-serve-static-core';
import { logger } from '../../util/logger';

export async function decodeJwtMw(req: IAppRequest, res: IAppResponse, next: NextFunction): Promise<void> {
  const {
    headers: { token },
  } = req;
  try {
    if (!token) {
      return next();
    }
    const accessToken: string = (token as string)?.split('Bearer ').pop();
    const user: any = await jwt.verify(accessToken, appConfig.jwtSecret);
    req.userId = user?._id;
    req.userJwtDecoded = user;
  } catch (error) {
    logger.error(error.message);
  }

  return next();
}
