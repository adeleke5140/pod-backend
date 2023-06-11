import { NextFunction } from 'express-serve-static-core';
import * as http from 'http';

import { HttpError } from '../../util/http-error';
import { StatusCodes } from 'http-status-codes';
import { IAppRequest } from '../../types/app-request';
import { IAppResponse } from '../../types/app-response';

// difference between this mw and jwt decode - this will fail if no user id found jwt, maybe convert to custom validator
export async function isAuthenticatedMw(
  req: IAppRequest,
  res: IAppResponse,
  next: NextFunction,
): Promise<void> {
  if (!req.userId) {
    return next(
      new HttpError(StatusCodes.UNAUTHORIZED, http.STATUS_CODES[StatusCodes.UNAUTHORIZED]),
    );
  }

  next();
}
