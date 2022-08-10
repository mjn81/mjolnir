import { Request, Response } from 'express';

import fileUpload from 'express-fileupload';
import {
  FileUploadError,
  ServerError,
  ValidationError,
} from '../errors';
import { MESSAGES } from '../constants';
import { createFilePath, concat } from '../utils';
import { prisma } from '../database';

export const uploadController = async (
  req: Request,
  res: Response,
) => {
  const { name, categories } = req.body;
  if (
    !req.files ||
    Object.keys(req.files).length === 0
  ) {
    throw new FileUploadError(
      MESSAGES['FILE_EMPTY'],
    );
  }
  if (!name || !categories)
    throw new ValidationError(
      MESSAGES['FIELD_EMPTY'],
      concat(['name', 'categories']),
    );

  const file = req.files
    .file as fileUpload.UploadedFile;
  const path = createFilePath(file.name);
  const fileData = await prisma.files.create({
    data: {
      name,
      path,
      category: {
        connect: categories,
      },
      user: {},
    },
  });
  file.mv(path, (err) => {
    if (err) throw new ServerError(err.message);
    res.send({
      message: MESSAGES['FILE_UPLOADED'],
      file: fileData,
    });
  });
};
