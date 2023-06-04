import { NextFunction, Request } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { IAppResponse } from '../../types/app-base-response';
import { HttpError } from '../../util/http-error';

// Generates HTML for response.
function generateHTML(error: HttpError): string {
  if (error) {
    return `<div style='text-align: center;'><p>Status: ${error.status}</p><p>Name: ${error.name}</p><p>${error}</p></div>`;
  }

  return '';
}

export function sendHttpErrorModule(req: Request, res: IAppResponse, next: NextFunction): void {
  res.sendHttpError = (error: HttpError): void => {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);

    /**
     * if this looks like an AJAX request
     * if this request has a "json" content-type AND ALSO has its "Accept" header set
     * if this request DOESN'T explicitly want HTML
     */
    if (req.xhr || req.is('json') || (req.is('json') && req.get('Accept')) || !(req.get('Accept') && req.get('Accept').indexOf('html') !== -1)) {
      res.json({
        status: error.status,
        name: error.name,
        message: error.message,
        errors: error.errors,
      });
    } else {
      res.send(generateHTML(error));
    }
  };

  return next();
}
