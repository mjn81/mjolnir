import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

import { FileUploadError, ValidationError } from '../errors';
import { MESSAGES } from '../constants';
import { BUCKET_NAME, getMongo, prisma, getS3 } from '../database';
import { roleBaseAuth } from '../helpers';
import { IFileServeSchema, IFileUpdateSchema } from '../schemas';

class FileController {
  async upload(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { name, category } = req.body;

    if (!category)
      throw new ValidationError(MESSAGES['FIELD_EMPTY'], 'category');

    const file = req.file;
    if (!file) {
      throw new FileUploadError(MESSAGES['FILE_EMPTY']);
    }
    const s3 = getS3();
    const id = nanoid();
    const key = `${user.id}/${id}-${file.originalname}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileData = await prisma.files.create({
      data: {
        name: name ?? file.originalname,
        path: key,
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
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.send({
      message: MESSAGES['FILE_UPLOADED'],
      data: fileData,
    });
  }
  /// adding diffrent modes 1 - public (for distrobuters) 2 - private
  async serve(req: ValidatedRequest<IFileServeSchema>, res: Response) {
    
    const { id } = req.params;
    const file = await prisma.files.findFirstOrThrow({
      where: {
        AND: [
          {
            id,
          },
        ],
      },
    });

    

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Accepted-Ranges', 'bytes');
    const s3 = getS3();
    const param = { Bucket: BUCKET_NAME, Key: file.path };
    
    const data = await s3.send(new GetObjectCommand(param));
    data.Body.pipe(res);

  }

  async delete(req: ValidatedRequest<IFileServeSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const file = await prisma.files.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        path: true,
      },
    });

    const s3 = getS3();
    const param = { Bucket: BUCKET_NAME, Key: file.path };
    await s3.send(new DeleteObjectCommand(param));
    return res.send({
      message: MESSAGES['FILE_DELETED'],
      file,
    });
  }

  async list(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const count = await prisma.files.count();
    const files = await prisma.files.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.send({
      files,
      count,
    });
  }

  async details(req: ValidatedRequest<IFileServeSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const file = await prisma.files.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return res.send({ file });
  }

  async update(req: ValidatedRequest<IFileUpdateSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    await prisma.files.findFirstOrThrow({
      where: {
        AND: [
          {
            id: id,
          },
          {
            user: {
              id: user.id,
            },
          },
        ],
      },
    });

    const { name, category } = req.body;
    const updatedFile = await prisma.files.update({
      where: {
        id,
      },
      data: {
        name: name,
        category: {
          connect: {
            id: category,
          },
        },
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.send({
      message: MESSAGES['FILE_UPDATED'],
      data: updatedFile,
    });
  }
}

export const fileController = new FileController();
