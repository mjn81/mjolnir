import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import fileUpload from 'express-fileupload';
import {
  FileUploadError,
  ServerError,
} from '../errors';
import { MESSAGES } from '../constants';
import { createFilePath } from '../utils';
import { prisma } from '../database';
import { IFileUploadSchema } from 'schemas';

export const uploadController = async (
  req: ValidatedRequest<IFileUploadSchema>,
  res: Response,
) => {
  const { name, category } = req.body;
  if (
    !req.files ||
    Object.keys(req.files).length === 0
  ) {
    throw new FileUploadError(
      MESSAGES['FILE_EMPTY'],
    );
  }

  const file = req.files
    .file as fileUpload.UploadedFile;
  const path = createFilePath(file.name);
  const fileData = await prisma.files.create({
    data: {
      name,
      path,
      category: {
        connect: category,
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
