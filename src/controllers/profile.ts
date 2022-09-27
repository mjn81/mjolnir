import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

import { roleBaseAuth } from '../helpers';
import { BUCKET_NAME, getS3, prisma } from '../database';
import { IServeProfileSchema } from '../schemas';
import { AuthorizationError, FileUploadError } from '../errors';
import { MESSAGES, PROFILE_MIMETYPES } from '../constants';

class ProfileController {
  create = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);

    const file = req.file;
    if (!file) throw new FileUploadError(MESSAGES['FILE_EMPTY']);
    if (file.size > 5000000)
      throw new FileUploadError(MESSAGES['FILE_SIZE_EXCEEDED']);
    if (!PROFILE_MIMETYPES.includes(file.mimetype))
      throw new FileUploadError(MESSAGES['FILE_INVALID_MIMETYPE']);

    const s3 = getS3();
    const id = nanoid();
    const key = `${user.id}/${id}-${file.originalname}`;
    const uploadParams = {
      Bucket: BUCKET_NAME.drive,
      Key: key,
      Body: file.buffer,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const profile = await prisma.profile.create({
      data: {
        path: key,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return res.json({
      message: MESSAGES['PROFILE_CREATED'],
      profile,
    });
  };

  delete = async (
    req: ValidatedRequest<IServeProfileSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const uProfile = await prisma.profile.findFirstOrThrow({
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

    const profile = await prisma.profile.delete({
      where: {
        id: uProfile.id,
      },
    });
    const s3 = getS3();
    const deleteParams = {
      Bucket: BUCKET_NAME.drive,
      Key: uProfile.path,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));

    return res.json({
      message: MESSAGES['PROFILE_DELETED'],
      profile,
    });
  };

  serve = async (
    req: ValidatedRequest<IServeProfileSchema>,
    res: Response,
  ) => {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const profile = await prisma.profile.findUniqueOrThrow({
      where: {
        id,
      },
    });
    const params = {
      Bucket: BUCKET_NAME.profile,
      Key: profile.path,
    };
    const s3 = getS3();
    const data = s3.send(new GetObjectCommand(params));
    data.Body.pipe(res);
  };
}

export const profileController = new ProfileController();
