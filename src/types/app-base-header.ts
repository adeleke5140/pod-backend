import { Request } from 'express-serve-static-core';
import { IncomingHttpHeaders } from 'http';

import { IBaseAppUser } from './app-user';

export interface IBaseAppHeaders extends IncomingHttpHeaders {
  // https://support.cloudflare.com/hc/en-us/articles/200168236-Configuring-Cloudflare-IP-Geolocation
  'cf-ipcountry'?: string;
  // https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
  'x-forwarded-proto'?: string;
  'x-forwarded-for'?: string;
  'x-forwarded-port'?: string;
  'x-forwarded-host'?: string;
  'x-srv-forwarded-host'?: string;
  'x-real-ip'?: string;
  'cf-connecting-ip'?: string;
  'x-country-code'?: string;
  'x-currency'?: string;
  'x-user-currency'?: string;
  'x-language'?: string;
  'x-country'?: string;
  'x-connecting-ip'?: string;
  'x-true-client-ip'?: string;
  'x-is-internal-request'?: string;
  // API Keys Portal
  'x-api-token'?: string;
  // user generated jwt
  'x-jwt-token'?: string;
  // decoded id from jwt
  'x-auth-user-id'?: string;
  // internal service to service api secret
  'x-t-secret'?: string;
}

export interface IBaseAppRequest extends Request {
  headers: IBaseAppHeaders | any;

  // jwt mw
  userJwtToken?: string;
  userJwtDecoded?: IBaseAppUser | Record<string, unknown> | string | undefined;
  userId?: string;

  // ip mw
  userIp: string;

  // language mw
  runtimeTLD: string;
  runtimeSubDomain: string;
  runtimeFullDomain: string;
  runtimeHost: string;
  runtimeProto: string;
  runtimePort: string;
  userIpCountry: string;
  currency: string;
  userCurrency: string;
}
