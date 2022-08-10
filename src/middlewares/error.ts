import { Request, Response } from 'express';

import { CustomError } from '../errors';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: Function,
) => {
  if (error instanceof CustomError) {
    return res.status(error.errorCode).send({
      errors: error.serializeErrors(),
    });
  }
  res.send({
    errors: {
      message: 'oops something went wrong!!',
    },
  });
};
