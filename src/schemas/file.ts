// import {
//   ContainerTypes,
//   ValidatedRequestSchema,
// } from 'express-joi-validation';
// import Joi from 'joi';

// export const fileUploadSchema = Joi.object({
//   name: Joi.string().required(),
//   category: Joi.object({
//     id: Joi.string().required(),
//   }).required(),
// });

// export interface IFileUploadSchema
//   extends ValidatedRequestSchema {
//   [ContainerTypes.Body]: {
//     name: string;
//     category: {
//       id: string;
//     };
//   };
// }
