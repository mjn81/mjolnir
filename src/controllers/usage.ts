import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { Role } from '@prisma/client';

import { IUsageDetailSchema, IUsageUpdateSchema } from '../schemas';
import { roleBaseAuth } from '../helpers';
import { prisma } from '../database';
import { MESSAGES } from '../constants';
import { InvalidRoleError } from '../errors';

class UsageController {
  update = async (
    req: ValidatedRequest<IUsageUpdateSchema>,
    res: Response,
  ) => {
    await roleBaseAuth(prisma, req.user, [Role.ADMIN]);
    const { id } = req.params;
    const { limit } = req.body;
    const limitNumber = BigInt(limit);
    const usage = await prisma.usage.update({
      where: {
        userId: id,
      },
      data: {
        limit: limitNumber,
      },
      select: {
        id: true,
        userId: true,
        limit: true,
        used: true,
      },
    });
    res.json({
      data: usage,
    });
  };

  details = async (
    req: ValidatedRequest<IUsageDetailSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new InvalidRoleError(MESSAGES['INSUFFICIENT_PERMISSION']);
    }
    const usage = await prisma.usage.findUnique({
      where: {
        userId: id,
      },
      select: {
        id: true,
        userId: true,
        limit: true,
        used: true,
      },
    });
    res.json({
      data: usage,
    });
  };
}

export const usageController = new UsageController();
