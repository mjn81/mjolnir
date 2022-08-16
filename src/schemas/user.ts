import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const userCreateSchema = Joi.object({
  userName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(9).required(),
  role: Joi.string().case('upper').required(),
}).required();

export interface IUserCreateSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
  };
}

export const userDeleteSchema = Joi.object({
  id: Joi.string().required(),
}).required();

export interface IUserDeleteSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const userUpdateSchema = Joi.object({
  userName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(9).required(),
  role: Joi.string().case('upper').required(),
}).required();

export interface IUserUpdateSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
  [ContainerTypes.Body]: {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
  };
}
