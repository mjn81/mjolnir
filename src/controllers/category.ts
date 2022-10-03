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
    const { name, color } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        color,
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
    const { name, color } = req.body;

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        color,
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
      select: {
        id: true,
        name: true,
        color: true,
        updatedAt: true,
        _count: {
          select: {
            files: true,
            distToken: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
      select: {
        id: true,
        color: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            files: true,
            distToken: true,
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
