import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const serveProfileSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IServeProfileSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
