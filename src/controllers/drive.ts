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
    const rootFiles = await this.getFilesForFolder(user.id);
    const response = this.sortFolderAndFile(rootFolders, rootFiles);
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

    const subFiles = await this.getFilesForFolder(user.id, id);
    const response = this.sortFolderAndFile(subFolders, subFiles);    

    res.send({
      ...folder,
      data: response,
    });
  };

  private getFilesForFolder = async (
    userId: string,
    folderId?: string,
  ) => {
    return await prisma.file.findMany({
      where: {
        AND: {
          user: {
            id: userId,
          },
          folder: folderId ? { id: folderId } : null,
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
        type: {
          select: {
            name: true,
          },
        },
      },
    });
  };

  private sortFolderAndFile = (folders: any[], files: any[]) => {
    const fo = folders.map((folder) => {
      return {
        ...folder,
        form: 'folder',
      };
    });
    const fi = files.map((file) => {
      return {
        ...file,
        form: 'file',
      };
    });

    const response = [...fo, ...fi].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return response;
  }
}

export const driveController = new DriveController();
