import Joi from 'joi';
import {
  ValidatedRequestSchema,
  ContainerTypes,
} from 'express-joi-validation';

export const catCreateSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required(),
}).required();
export interface ICatCreateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    color: string;
  };
}

export const catUpdateBody = Joi.object({
  name: Joi.string().required(),
}).required();
export const catUpdateParam = Joi.object({
  id: Joi.string().required(),
  color: Joi.string().required(),
}).required();

export interface ICatUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    color: string;
  };
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface ICatDeleteSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
