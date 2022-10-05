import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import { IDriveDetailSchema } from '../schemas';

class DriveController {
  rootDrive = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const rootFolders = await prisma.folder.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          parent: null,
        },
      },
    });
    const rootFiles = await prisma.file.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          folder: null,
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        }
      },
    });
    const folders = rootFolders.map((folder) => {
      return {
        ...folder,
        type: 'folder',
      };
    });
    const files = rootFiles.map((file) => {
      return {
        ...file,
        type: 'file',
      };
    });

    const response = [...folders, ...files].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    res.send({
      data: response,
    });
  };

  subDrive = async (
    req: ValidatedRequest<IDriveDetailSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const folder = await prisma.folder.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    const subFolders = await prisma.folder.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          parent: {
            id: id,
          },
        },
      },
    });

    const subFiles = await prisma.file.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          folder: {
            id: id,
          },
        },
      },
    });

    const folders = subFolders.map((folder) => {
      return {
        ...folder,
        type: 'folder',
      };
    });
    const files = subFiles.map((file) => {
      return {
        ...file,
        type: 'file',
      };
    });

    const response = [...folders, ...files].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    res.send({
      ...folder,
      data: response,
    });
  };
}

export const driveController = new DriveController();
