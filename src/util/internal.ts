//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //

import { appConfig } from '../config/env';

export function getInternalApiSecret({ to }: { to: string }): string {
  const secretInEnv: string = process.env[`OUT_TO_${to.toUpperCase().replace(/-/g, '_')}`] || '';
  return secretInEnv + '|*|' + appConfig.name.toUpperCase().replace(/-/g, '_');
}

export function validateInternalApiSecret({ secret }: { secret: string }): boolean {
  // 11111|*|module-account
  const [secretInRequest, caller] = secret?.split('|*|');

  if (!secretInRequest || !caller) {
    return false;
  }

  const secretInEnv: string = process.env[`IN_FROM_${caller}`];

  return secretInEnv && secretInEnv === secretInRequest;
}
