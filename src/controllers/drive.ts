import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import { IDriveDetailSchema } from '../schemas';

class DriveController {
  rootDrive = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const rootFolders = await prisma.folders.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          parent: null,
        },
      },
    });
    const rootFiles = await prisma.files.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          folder: null,
        },
      },
    });
    res.send({
      folders: {
        ...rootFolders,
      },
      files: {
        ...rootFiles,
      },
    });
  };

  subDrive = async (
    req: ValidatedRequest<IDriveDetailSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;

    const subFolders = await prisma.folders.findMany({
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

    const subFiles = await prisma.files.findMany({
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

    res.send({
      folders: subFolders,
      files: subFiles,
    });
  };
}

export const driveController = new DriveController();
