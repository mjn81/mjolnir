import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';

export const fileServeSchema = Joi.object({
  id: Joi.string().required(),
});

export interface IFileServeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const fileListSchema = Joi.object({
  category: Joi.string().required(),
});

export interface IFileListSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    category: string;
  };
}

export const fileUploadParam = Joi.object({
  id: Joi.string().required(),
});

export const fileUpdateBody = Joi.object({
  name: Joi.string().required(),
  category: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
      }),
    )
    .required(),
});

export interface IFileUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    category: {
      id: string;
    }[];
  };
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const changeAccessSchema = Joi.object({
  isPublic: Joi.boolean().required(),
});

export interface IFileChangeAccessSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    isPublic: boolean;
  };
  [ContainerTypes.Params]: {
    id: string;
  };
}
