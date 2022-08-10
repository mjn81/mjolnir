import { Request, Response } from 'express';

import fileUpload from 'express-fileupload';
import { v4 } from 'uuid';
import path from 'path';
import { FileUploadError } from '../errors';
// import { prisma } from 'database';

export const uploadController = async (
  req: Request,
  res: Response,
) => {
  if (
    !req.files ||
    Object.keys(req.files).length === 0
  ) {
    throw new FileUploadError(
      'No files were uploaded.',
    );
  }
  const file = req.files
    .file as fileUpload.UploadedFile;
  const filename = v4() + file.name;
  const uploadPath = path.resolve(
    __dirname,
    '..',
    '..',
    'uploads',
    filename,
  );
  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'File uploaded!' });
  });
};

export const playgroundController = (
  _req: Request,
  res: Response,
) => {
  res.send({ message: 'Hello World' });
};
