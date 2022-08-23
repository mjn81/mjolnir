import { prisma } from '../database';
import { Request, Response } from 'express';
import { roleBaseAuth } from '../helpers';

class FolderController {
  async rootList(req: Request, res: Response) {
    const user = await roleBaseAuth(
      prisma,
      req.user,
    );

    const count = await prisma.folders.count({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          parent: null,
        },
      },
    });
    const folders = await prisma.folders.findMany(
      {
        where: {
          AND: {
            user: {
              id: user.id,
            },
            parent: null,
          },
        },
      },
    );

    res.send({ folders, count });
  }
}

export const folderController =
  new FolderController();
