import Joi from 'joi';
import {
  ValidatedRequestSchema,
  ContainerTypes,
} from 'express-joi-validation';

export const catCreateSchema = Joi.object({
  name: Joi.string().required(),
});

export const catUpdateSchema = Joi.object({
  userName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(9).required(),
});

export interface ICatCreateSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
  };
}
