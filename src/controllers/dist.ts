import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ValidatedRequest } from 'express-joi-validation';

import { roleBaseAuth } from '../helpers';
import { prisma } from '../database';
import { IDeleteDistSchema, IServeDistSchema } from '../schemas';
import { AuthorizationError } from '../errors';
import { MESSAGES } from '../constants';

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
      include: {
        file: {
          select: {
            path: true,
            category: {
              select: {
                id: true,
              },
            },
          },
          include: {
            user: true,
          },
        },
      },
    });
  };
}

export const distController = new DistController();
