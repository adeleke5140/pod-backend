import { logger } from '../../util/logger';
import cors from 'cors';
import bodyParser from 'body-parser';
import { IAppResponse } from '../../types/app-base-response';
import cookieParser from 'cookie-parser';
import { IAppRequest } from '../../types/app-request';
import morgan from 'morgan';
import { AxiosError } from 'axios';
import compression from 'compression';
import { decodeJwtMw } from './decode-jwt-mw';
import { appConfig } from '../env';
import { HttpError } from '../../util/http-error';
import { Application } from 'express-serve-static-core';
import { sendHttpErrorModule } from '../error/send-http-error';

type HttpErrorType = {
  status: number;
  name: string;
  message: string;
  errors: {
    value: string;
    msg: string;
    param: string;
    location: string;
  }[];
};

export function configureMiddleware(app: Application): void {
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
  );
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', ['*']); //<--
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization',
    );
    next();
  });
  // todo sentryClient.Handlers
  // todo lang
  // todo dev_uniqid for mobile devices
  // todo accept-language
  app.disable('x-powered-by');
  // express middleware

  // custom errors
  app.use(sendHttpErrorModule);

  // Do not log http requests if NODE_ENV is testing
  if (!appConfig.isTesting) {
    // http request logger middleware
    app.use(morgan('combined'));
  }

  app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );
  app.use(bodyParser.json({ limit: process.env.JSON_MAX_LIMIT ?? '100kb' }));
  // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());
  // returns the compression middleware
  app.use(compression());
  app.use(decodeJwtMw);

  // // Add cookie session
  // app.use(
  //   cookieSession({
  //     maxAge: 24 * 60 * 60 * 1000, // 1 day
  //     keys: [''],
  //   }),
  // );

  // // Initialize passport to use cookies
  // app.use(passport.initialize());
  // app.use(passport.session());
}

/**
 * @export
 * @param {Application} app
 */
export function initErrorHandler(app: Application): void {
  app.use((error: Error, _: IAppRequest, res: IAppResponse): void => {
    let errorCode: number = typeof error === 'number' ? error : 500;
    let errorMessage: string = error.message;
    let errorsList: HttpErrorType['errors'] = [];
    let errorsListStr: string = '';
    const stack: string = (error?.stack || '').replace(/\s+/g, ' ');

    let internalCallUrl: string = '';
    let internalCallData: string = '';

    // If this is an error on HTTP call from any secondary APIs
    if ((error as AxiosError<HttpErrorType>)?.response?.data?.message) {
      const axiosError: AxiosError<HttpErrorType> = error as AxiosError<HttpErrorType>;
      const httpError: HttpErrorType = axiosError.response.data;

      internalCallData = JSON.stringify(axiosError?.config?.data || '', null, 2).replace(
        /\s+/g,
        ' ',
      );
      internalCallUrl = axiosError?.config?.url;
      errorCode = httpError.status;
      errorMessage = httpError.message;
      errorsList = httpError.errors;

      errorsListStr = JSON.stringify(errorsList, null, 2) || '';
      errorsListStr = errorsListStr.replace(/\s+/g, ' ');
    } else if (error instanceof HttpError) {
      errorCode = error.status;
      errorMessage = error.message;
      errorsList = error.errors;
    }

    if (!appConfig.isTesting) {
      if (process.env.ERR_LOG_MSG_ONLY) {
        logger.error(
          `${internalCallUrl} ${errorCode} ${errorMessage} ${errorsListStr} ${internalCallData}`.trim(),
        );
      } else {
        logger.error(`${internalCallUrl} ${errorCode} ${errorMessage} ${errorsListStr} ${stack}`);
      }
    }

    if (res.headersSent) {
      return;
    }

    res.sendHttpError(new HttpError(errorCode, errorMessage, errorsList));
  });
}
