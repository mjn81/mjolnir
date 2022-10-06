import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

import {
  AuthorizationError,
  FileUploadError,
  ValidationError,
} from '../errors';
import { MESSAGES } from '../constants';
import { BUCKET_NAME, prisma, getS3 } from '../database';
import { roleBaseAuth } from '../helpers';
import {
  IFileChangeAccessSchema,
  IFileServeSchema,
  IFileUpdateSchema,
  IFileUploadSchema,
} from '../schemas';
import { Access } from '@prisma/client';

class FileController {
  upload = async (
    req: ValidatedRequest<IFileUploadSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { name, category, folder } = req.body;
    const tags = this.checkTag(category);
    const file = req.file;
    if (!file) {
      throw new FileUploadError(MESSAGES['FILE_EMPTY']);
    }
    // check users usage
    const userUsage = await prisma.usage.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
      select: {
        limit: true,
        used: true,
      },
    });
    const size = file.size;
    const totalSize = userUsage.used + BigInt(size);
    const remaining = userUsage.limit - totalSize;
    if (remaining < 0) {
      throw new FileUploadError(MESSAGES['FILE_LIMIT_EXCEEDED']);
    }

    const s3 = getS3();
    const id = nanoid();
    const key = `${user.id}/${id}-${file.originalname}`;

    const uploadParams = {
      Bucket: BUCKET_NAME.drive,
      Key: key,
      Body: file.buffer,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    await prisma.usage.update({
      where: {
        userId: user.id,
      },
      data: {
        used: totalSize,
      },
    });
    const type = await prisma.mimeType.findUnique({
      where: {
        extension: file.mimetype,
      },
    });
    let data: any = {
      name: name ?? file.originalname,
      path: key,
      mimeType: file.mimetype,

      size: size,
      category: {
        connect: tags,
      },
      type: {
        connect: {
          id: type?.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    if (folder) {
      data = {
        ...data,
        folder: {
          connect: {
            id: folder,
          },
        },
      };
    }
    const fileData = await prisma.file.create({
      data: data,
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
  };

  private checkTag = (category: string | string[]) => {
    let tags;
    if (typeof category === 'string') {
      tags = { id: category };
    } else {
      if (category.length === 0)
        throw new ValidationError(MESSAGES['FIELD_EMPTY'], 'category');
      tags = category.map((c) => ({ id: c }));
    }
    if (!tags)
      throw new ValidationError(MESSAGES['FIELD_EMPTY'], 'category');

    return tags;
  };

  async serve(req: ValidatedRequest<IFileServeSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const file = await prisma.file.findFirstOrThrow({
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

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Accepted-Ranges', 'bytes');
    const s3 = getS3();
    const param = { Bucket: BUCKET_NAME.drive, Key: file.path };

    const data = await s3.send(new GetObjectCommand(param));
    data.Body.pipe(res);
  }

  async delete(req: ValidatedRequest<IFileServeSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    const uFile = await prisma.file.findFirstOrThrow({
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

    const file = await prisma.file.delete({
      where: {
        id: uFile.id,
      },
      select: {
        id: true,
        name: true,
        path: true,
        size: true,
      },
    });

    const s3 = getS3();
    const param = { Bucket: BUCKET_NAME.drive, Key: file.path };
    await s3.send(new DeleteObjectCommand(param));

    await prisma.usage.update({
      where: {
        userId: user.id,
      },
      data: {
        used: {
          decrement: file.size,
        },
      },
    });

    return res.send({
      message: MESSAGES['FILE_DELETED'],
      file,
    });
  }

  async list(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const count = await prisma.file.count();
    const files = await prisma.file.findMany({
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
        type: {
          select: {
            name: true,
            extension: true,
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
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
    if (file.userId !== user.id)
      throw new AuthorizationError(MESSAGES['FORBIDDEN']);
    return res.send({ ...file });
  }

  async update(req: ValidatedRequest<IFileUpdateSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    await prisma.file.findFirstOrThrow({
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
    const tags = category.map((c) => ({ id: c }));
    const updatedFile = await prisma.file.update({
      where: {
        id,
      },
      data: {
        name: name,
        category: {
          set: tags,
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

  changeAccess = async (
    req: ValidatedRequest<IFileChangeAccessSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { isPublic } = req.body;
    const { id } = req.params;
    await prisma.file.findFirstOrThrow({
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
    const access = isPublic ? Access.PUBLIC : Access.PRIVATE;
    const file = await prisma.file.update({
      where: {
        id: id,
      },
      data: {
        access: access,
      },
      select: {
        id: true,
        name: true,
        access: true,
      },
    });

    res.json({
      message: 'successfull',
      file,
    });
  };
}

export const fileController = new FileController();
