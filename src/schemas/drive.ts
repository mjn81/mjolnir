import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const driveDetailSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IDriveDetailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
