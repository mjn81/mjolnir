import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const folderCreateSchema = Joi.object({
  name: Joi.string().required(),
  parent: Joi.string().optional(),
});

export interface IFolderCreateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    parent?: string;
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
