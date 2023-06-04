import { IBaseAppHeaders, IBaseAppRequest } from './app-base-header';
import { IBaseAppUser } from './app-user';

export type IAppHeaders = IBaseAppHeaders;

export interface IAppRequest extends IBaseAppRequest {
  headers: IAppHeaders;
  user: IBaseAppUser;
}
