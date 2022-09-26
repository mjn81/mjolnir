import { Request, Response } from 'express';

import { roleBaseAuth } from '../helpers';
import { prisma } from '../database';

class DistController {
  distRoute = async (req: Request, res: Response) => {
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
}

export const distController = new DistController();
