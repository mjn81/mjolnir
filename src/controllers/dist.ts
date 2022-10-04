import { Request, Response } from 'express';
import { Access, Role } from '@prisma/client';
import { ValidatedRequest } from 'express-joi-validation';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { roleBaseAuth } from '../helpers';
import { BUCKET_NAME, getS3, prisma } from '../database';
import {
  IDeleteDistSchema,
  IDeleteDistTokenSchema,
  IDistTokenSchema,
  IServeDistSchema,
} from '../schemas';
import { AuthorizationError } from '../errors';
import { MESSAGES } from '../constants';
import { createDistToken } from '../utils';

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
    const route = await prisma.distRoute.create({
      data: {
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
      ...distRoute,
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
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id: id,
      },
      select: {
        access: true,
        mimeType: true,
        path: true,
        user: true,
        category: true,
      },
    });
    if (file.user.id !== distRoute.user.id)
      throw new AuthorizationError(MESSAGES['INSUFFICIENT_PERMISSION']);

    if (file.access === Access.PRIVATE) {
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
      const fileCats = file.category;

      if (category) {
        const exist = fileCats.find((cat) => cat.id === category.id);
        console.log(exist);
        if (!exist) {
          throw new AuthorizationError(MESSAGES['UNAUTHORIZED']);
        }
      }
    }
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Accepted-Ranges', 'bytes');
    const s3 = getS3();
    const param = { Bucket: BUCKET_NAME.drive, Key: file.path };

    const data = await s3.send(new GetObjectCommand(param));
    data.Body.pipe(res);
  };

  createToken = async (
    req: ValidatedRequest<IDistTokenSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { category } = req.body;

    const token = createDistToken({
      username: user.userName,
      id: user.id,
    });
    let data: any = {
      token,
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    if (category)
      data = {
        ...data,
        category: {
          connect: {
            id: category,
          },
        },
      };

    const tokenData = await prisma.distToken.create({
      data: data,
      select: {
        token: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    let route = await prisma.distRoute.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        route: true,
      },
    });
    if (!route) {
      route = await prisma.distRoute.create({
        data: {
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
    }
    res.json({
      message: MESSAGES['DISTRIBUTOR_TOKEN_SUCCESS'],
      dist: {
        ...tokenData,
        ...route,
      },
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  };

  listToken = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const tokens = await prisma.distToken.findMany({
      where: {
        userId: user.id,
      },
      select: {
        token: true,
        category: {
          select: {
            name: true,
            color: true,
            _count: {
              select: {
                files: true,
              },
            },
          },
        },
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json({
      tokens,
    });
  };

  deleteToken = async (
    req: ValidatedRequest<IDeleteDistTokenSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const tokenToDelete = await prisma.distToken.findUniqueOrThrow({
      where: {
        id: id,
      },
      select: {
        user: true,
      },
    });
    if (tokenToDelete.user.id !== user.id)
      throw new AuthorizationError(MESSAGES['INSUFFICIENT_PERMISSION']);
    const token = await prisma.distToken.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: MESSAGES['DISTRIBUTOR_TOKEN_DELETED'],
      ...token,
    });
  };
}

export const distController = new DistController();
