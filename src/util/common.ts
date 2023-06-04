//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //

import omit from 'lodash/omit';
import { KeyValAny } from '../types/common';
import { appConfig } from '../config/env';
import { logger } from './logger';

// Remove the extra or sensitive data from the object
export function omitFields(data: KeyValAny, fields: unknown = null): KeyValAny {
  // we need following fields in the testing env so that we can validate the
  // providers response along with the other fields
  if (!fields && !appConfig.isTesting) {
    fields = ['headers', 'response', 'metadata.providerConfig'];
  }

  return omit(data, fields as any);
}

export function isDateValid(date: string): boolean {
  return !isNaN(Date.parse(date));
}

/**
 * Tries executing the given callback or return default value
 */
export async function tryRunning(callback: () => unknown | any, defaultValue: unknown | any): Promise<unknown | any> {
  try {
    return await callback();
  } catch (e) {
    logger.error(e);

    return defaultValue;
  }
}

/**
 * sanitize request headers to remove sensitive headers
 * sensitive headers: x-jwt-token, cookie
 */
// export function sanitizeHeaders(rawHeaders: IAppHeaders): IAppHeaders {
//   const sensitiveHeaders: string[] = ['x-jwt-token', 'cookie'];
//   return omitFields(rawHeaders, sensitiveHeaders);
// }
