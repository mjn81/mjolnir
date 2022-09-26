import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const usageDetailSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IUsageDetailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const usageUpdateSchema = Joi.object({
  limit: Joi.number().required(),
});

export const usageUpdateParamSchema = Joi.object({
  id: Joi.string().required(),
});


export interface IUsageUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
  [ContainerTypes.Body]: {  
    limit: string;
  };
}
