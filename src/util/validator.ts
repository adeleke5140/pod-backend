import { NextFunction, Request, Response } from 'express-serve-static-core';
import { SanitizationChain, ValidationChain } from 'express-validator';
import { Result, ValidationError, validationResult } from 'express-validator';
import { HttpError } from './http-error';

type ReqValidationResultType = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type BaseValidationType = (ValidationChain | SanitizationChain | ReqValidationResultType)[];

export async function reqValidationResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors: Result<ValidationError> = validationResult(req);

  if (errors.isEmpty()) {
    next();

    return;
  }

  const errArr: ValidationError[] = errors.array();
  const msgArr: string[] = errArr.map((validationError: ValidationError) => `${validationError.param} ${validationError.msg.toLowerCase()}`);

  next(new HttpError(400, [...new Set(msgArr)].join('\n'), errArr));
  return;
}
