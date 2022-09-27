import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import {
  ICatCreateSchema,
  ICatDeleteSchema,
  ICatUpdateSchema,
} from '../schemas';

import { MESSAGES } from '../constants';

class CategoryController {
  async create(req: ValidatedRequest<ICatCreateSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { name } = req.body;

    const category = await prisma.category.create({
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

  async update(req: ValidatedRequest<ICatUpdateSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.update({
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
    const user = await roleBaseAuth(prisma, req.user);
    const count = await prisma.category.count();
    const categories = await prisma.category.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      include: {
        _count: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.send({
      categories,
      count,
    });
  }

  async detail(req: ValidatedRequest<ICatDeleteSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    const category = await prisma.category.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            files: true,
          },
        },
      },
    });
    res.send({
      category,
    });
  }

  async delete(req: ValidatedRequest<ICatDeleteSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    const category = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.send({
      message: MESSAGES['CATEGORY_DELETED'],
      category,
    });
  }
}

export const categoryController = new CategoryController();
