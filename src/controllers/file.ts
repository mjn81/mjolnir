import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

import {
  FileUploadError,
  ValidationError,
} from '../errors';
import { MESSAGES } from '../constants';
import { getMongo, prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import { IFileServeSchema } from '../schemas';

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

    const readableFileStream = new Readable();
    readableFileStream.push(file.buffer);
    readableFileStream.push(null);

    const db = getMongo();
    const bucket = new GridFSBucket(db, {
      bucketName: 'files',
    });

    let uploadStream =
      bucket.openUploadStream(name);
    const { id } = uploadStream;
    readableFileStream.pipe(uploadStream);
    uploadStream.on('error', () => {
      throw new FileUploadError(
        MESSAGES['SERVER_ERROR'],
      );
    });

    const fileData = await prisma.files.create({
      data: {
        name: name ?? file.originalname,
        path: id.toString(),
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

  async serve(
    req: ValidatedRequest<IFileServeSchema>,
    res: Response,
  ) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
    );
    const { id } = req.params;
    const file =
      await prisma.files.findFirstOrThrow({
        where: {
          AND: [
            {
              id,
            },
            {
              user: {
                id: user.id,
              },
            },
          ],
        },
      });

    const fileId = new ObjectId(file.path);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Accepted-Ranges', 'bytes');

    const db = getMongo();
    const bucket = new GridFSBucket(db, {
      bucketName: 'files',
    });
    const downloadStream =
      bucket.openDownloadStream(fileId);
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (err) => {
      throw new FileUploadError(err.message);
    });
    downloadStream.on('end', () => {
      res.end();
    });
  }
}

export const fileController =
  new FileController();
