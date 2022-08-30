import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const folderCreateSchema = Joi.object({
  name: Joi.string().required(),
  parent: Joi.string().optional().allow(null),
});

export interface IFolderCreateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    parent: string | null;
  };
}

export const folderDetailSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IFolderDetailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
