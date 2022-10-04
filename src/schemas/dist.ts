import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const deleteDistSchema = Joi.object({
  id: Joi.string().required(),
}).required();

export interface IDeleteDistSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const paramServeDistSchema = Joi.object({
  id: Joi.string().required(),
  route: Joi.string().required(),
}).required();

export const queryServeDistSchema = Joi.object({
  token: Joi.string().optional(),
}).required();

export interface IServeDistSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    token?: string;
  };
  [ContainerTypes.Params]: {
    id: string;
    route: string;
  };
}

export const distTokenSchema = Joi.object({
  category: Joi.string().optional().allow('').allow(null),
}).required();

export interface IDistTokenSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    category?: string;
  };
}
