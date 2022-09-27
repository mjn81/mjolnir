import { Request, Response } from 'express';
import { Access, Role } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ValidatedRequest } from 'express-joi-validation';

import { roleBaseAuth } from '../helpers';
import { BUCKET_NAME, getS3, prisma } from '../database';
import { IDeleteDistSchema, IServeDistSchema } from '../schemas';
import { AuthorizationError } from '../errors';
import { MESSAGES } from '../constants';
import category from 'docs/category';
import { GetObjectCommand } from '@aws-sdk/client-s3';

class DistController {
  /// basic works for {dist routes}
  createRoute = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const data = await prisma.distRoute.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (data) {
      res.json({
        message: 'Already created',
        route: data.route,
      });
    }
    const distRoute = nanoid();
    const route = await prisma.distRoute.create({
      data: {
        route: distRoute,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        route: true,
      },
    });

    res.json({
      message: 'Created',
      ...route,
    });
  };
  getRoute = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const distRoute = await prisma.distRoute.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        route: true,
      },
    });

    res.json({
      dist: {
        ...distRoute,
      },
    });
  };
  deleteRoute = async (
    req: ValidatedRequest<IDeleteDistSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    if (user.role !== Role.ADMIN && user.id !== id)
      throw new AuthorizationError(MESSAGES['INSUFFICIENT_PERMISSION']);

    const route = await prisma.distRoute.delete({
      where: {
        userId: id,
      },
    });

    res.json({
      message: 'Deleted',
      ...route,
    });
  };

  /// dist servings
  serve = async (
    req: ValidatedRequest<IServeDistSchema>,
    res: Response,
  ) => {
    const { id, route } = req.params;
    const { token } = req.query;

    ///// ADD influx and log user ip + served file & ... inside influx

    const distRoute = await prisma.distRoute.findUniqueOrThrow({
      where: {
        route: route,
      },
      include: {
        user: true,
      },
    });
    const distFile = await prisma.distFile.findUniqueOrThrow({
      where: {
        fileId: id,
      },
      select: {
        access: true,
        file: {
          select: {
            mimeType: true,
            path: true,
            user: true,
            category: true,
          },
        },
      },
    });

    if (distFile.file.user.id !== distRoute.user.id)
      throw new AuthorizationError(MESSAGES['INSUFFICIENT_PERMISSION']);

    const access = distFile.access;

    if (access === Access.PRIVATE) {
      if (!token) throw new AuthorizationError(MESSAGES['UNAUTHORIZED']);

      const distToken = await prisma.distToken.findUniqueOrThrow({
        where: {
          token: token,
        },
        select: {
          user: true,
          category: true,
        },
      });
      if (distToken.user.id !== distRoute.user.id)
        throw new AuthorizationError(MESSAGES['UNAUTHORIZED']);

      const category = distToken.category;
      const fileCats = distFile.file.category;
      if (category) {
        const exist = fileCats.find((cat) => cat.id === category.id);
        if (!exist) {
          throw new AuthorizationError(MESSAGES['UNAUTHORIZED']);
        }
      }
    }
    const file = distFile.file;
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Accepted-Ranges', 'bytes');
     const s3 = getS3();
     const param = { Bucket: BUCKET_NAME.drive, Key: file.path };

     const data = await s3.send(new GetObjectCommand(param));
     data.Body.pipe(res);
  };
}

export const distController = new DistController();
