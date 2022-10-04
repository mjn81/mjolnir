import Joi from 'joi';
import {
  ValidatedRequestSchema,
  ContainerTypes,
} from 'express-joi-validation';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(9).required(),
}).required();

export interface ILoginSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    password: string;
  };
}
export const registerSchema = Joi.object({
  userName: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(9).required(),
}).required();

export interface IRegisterSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userName: string;
    fullName: string;
    email: string;
    password: string;
  };
}
