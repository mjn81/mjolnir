import { createValidator } from 'express-joi-validation';
import { ERROR_CODE } from '../constants';

export const validator = createValidator({
  passError: true,
  statusCode: ERROR_CODE['VALIDATION_ERROR'],
});

export const bodyValidator = validator.body;

export const queryValidator = validator.query;

export const paramsValidator = validator.params;
