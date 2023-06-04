//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //
import tracer, { Tracer } from 'tracer';

import { appConfig } from '../config/env';

let logger: Tracer.Logger = tracer.colorConsole();

// No color logs if testing or production
if (appConfig.isProduction) {
  logger = tracer.console();
}

// Disable tracer if testing
if (appConfig.isTesting) {
  tracer.close();
}

export { logger };
