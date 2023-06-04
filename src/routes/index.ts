import http from 'http';
import { StatusCodes } from 'http-status-codes';
import { Application } from 'express-serve-static-core';

import { IAppRequest } from '../types/app-request';
import { IAppResponse } from '../types/app-response';
import { userRoutes } from '../modules/user/routes';

export function initRouter(app: Application): void {
  app.use('/user/', userRoutes);

  // Register no route found
  app.use(
    (_: IAppRequest, res: IAppResponse): IAppResponse => {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: http.STATUS_CODES[StatusCodes.NOT_FOUND],
      });
    },
  );
}
