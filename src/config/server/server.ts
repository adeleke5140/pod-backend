import express from 'express';
import { Application } from 'express-serve-static-core';

import '../connection/connection';
import { appConfig } from '../env';
import { initRouter } from '../../routes';
import { configureMiddleware, initErrorHandler } from '../mw/middleware';

/**
 * @constant {Application}
 */
const app: Application = express();

// Serve assets from the disk path
if (appConfig.isDevelopment) {
  app.use(express.static(`/tmp/${appConfig.name}`));
}

/**
 * @constructs Application Middleware
 */
configureMiddleware(app);

/**
 * @constructs Application Routes
 */
initRouter(app);

/**
 * @constructs Application Error Handler
 */
initErrorHandler(app);

/**
 * @constructs Application Cron Jobs
 */
//initCronJobs(app);

/**
 * @exports {Application}
 */
export { app };
