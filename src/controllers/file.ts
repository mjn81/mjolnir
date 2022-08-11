import { Request, Response } from 'express';

import {
  FileUploadError,
  ValidationError,
} from '../errors';
import { MESSAGES } from '../constants';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';

class FileController {
  async upload(req: Request, res: Response) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
    );
    const { name, category } = req.body;

    if (!category)
      throw new ValidationError(
        MESSAGES['FIELD_EMPTY'],
        'category',
      );

    const file = req.file;
    if (!file) {
      throw new FileUploadError(
        MESSAGES['FILE_EMPTY'],
      );
    }

    const fileData = await prisma.files.create({
      data: {
        name: name ?? file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        category: {
          connect: {
            id: category,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.send({
      message: MESSAGES['FILE_UPLOADED'],
      data: fileData,
    });
  }

  async serve(_req: Request, _res: Response) {}
}

export const fileController =
  new FileController();
