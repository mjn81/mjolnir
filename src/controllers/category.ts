import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { Role } from '@prisma/client';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import { ICatCreateSchema } from '../schemas';

import { MESSAGES } from '../constants';

class CategoryController {
  async create(
    req: ValidatedRequest<ICatCreateSchema>,
    res: Response,
  ) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
      [Role.ADMIN],
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

  async update(req: Request, res: Response) {
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
}

export const categoryController =
  new CategoryController();
