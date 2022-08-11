import { Request, Response } from 'express';

import {
  FileUploadError,
  ValidationError,
} from '../errors';
import { MESSAGES } from '../constants';
import { prisma } from '../database';

export const uploadController = async (
  req: Request,
  res: Response,
) => {
  const { name, category } = req.body;

  const file = req.file;
  if (!category)
    throw new ValidationError(
      MESSAGES['FIELD_EMPTY'],
      'category',
    );

  if (!file) {
    throw new FileUploadError(
      MESSAGES['FILE_EMPTY'],
    );
  }
  const fileData = await prisma.files.create({
    data: {
      name: name ?? file.originalname,
      path: file.path,
      category: {
        connect: category,
      },
      user: {},
    },
  });
  res.send({
    message: MESSAGES['FILE_UPLOADED'],
    data: fileData,
  });
};
