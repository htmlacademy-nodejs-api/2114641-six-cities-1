import { Types } from 'mongoose';
import { MiddlewareInterface } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (!Types.ObjectId.isValid(objectId)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${objectId} is invalid ObjectID`, 'ValidateObjectIdMiddleware');
    }

    return next();
  }
}
