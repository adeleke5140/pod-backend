//  GLOBAL COMMON / UTIL functions   //
//  -------------------------------  //
//  DON'T ADD Common or UTIL HERE!   //
//  -------------------------------  //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
//  -------------------------------  //

import { NextFunction, RequestHandler } from 'express-serve-static-core';

import { IAppRequest } from '../types/app-request';
import { IAppResponse } from '../types/app-response';

// Catch error that are throw inside route
export function catchAsyncErrors(fn: RequestHandler): RequestHandler {
  return (req: IAppRequest, res: IAppResponse, next: NextFunction): void => {
    const routePromise: any = fn(req, res, next);

    if (routePromise.catch) {
      routePromise.catch((err: Error): void => next(err));
    }
  };
}
