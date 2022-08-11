import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const fileServeSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IFileServeSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
