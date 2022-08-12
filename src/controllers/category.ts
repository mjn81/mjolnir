import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import {
  ICatCreateSchema,
  ICatUpdateSchema,
} from '../schemas';

import { MESSAGES } from '../constants';

class CategoryController {
  async create(
    req: ValidatedRequest<ICatCreateSchema>,
    res: Response,
  ) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
    );
    const { name } = req.body;

    const category =
      await prisma.categories.create({
        data: {
          name,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

    res.send({
      message: MESSAGES['CATEGORY_CREATED'],
      category,
    });
  }

  async update(
    req: ValidatedRequest<ICatUpdateSchema>,
    res: Response,
  ) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const { name } = req.body;

    const category =
      await prisma.categories.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

    res.send({
      message: MESSAGES['CATEGORY_UPDATED'],
      category,
    });
  }

  async list(req: Request, res: Response) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
    );
    const count = await prisma.categories.count();
    const categories =
      await prisma.categories.findMany({
        where: {
          user: {
            id: user.id,
          },
        },
        include: {
          _count: true,
        },
      });

    res.send({
      categories,
      count,
    });
  }
}

export const categoryController =
  new CategoryController();
