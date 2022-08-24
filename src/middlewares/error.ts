import { ERROR_CODE } from '../constants';
import { Request, Response } from 'express';

import { CustomError } from '../errors';
import {
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

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
  if (error instanceof PrismaClientValidationError)
    return res.status(ERROR_CODE['BAD_REQUEST']).send({
      errors: {
        message: error.message,
      },
    });

  if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientUnknownRequestError
  ) {
    return res.status(ERROR_CODE['INTERNAL_SERVER_ERROR']).send({
      errors: {
        message: 'oops something went wrong with database!!',
      },
    });
  }
  return res.status(ERROR_CODE['BAD_REQUEST']).send({
    errors: {
      error,
    },
  });
};
