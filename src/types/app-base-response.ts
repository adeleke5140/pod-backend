import { Response } from 'express-serve-static-core';
import { HttpError } from '../util/http-error';

export interface IBaseAppResponse extends Response {}

// error middleware formatter
export interface IAppResponse extends IBaseAppResponse {
  sendHttpError: (error: HttpError | Error, message?: string) => void;
}
