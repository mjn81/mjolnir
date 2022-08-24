import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { IFolderCreateSchema, IFolderDetailSchema } from '../schemas';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';

class FolderController {
  async rootList(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);

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
    const folders = await prisma.folders.findMany({
      where: {
        AND: {
          user: {
            id: user.id,
          },
          parent: null,
        },
      },
    });

    res.send({ folders, count });
  }

  async create(req: ValidatedRequest<IFolderCreateSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    // phase 3 : refactor

    const { name, parent } = req.body;
    let query: any = {
      data: {
        name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    };
    if (parent)
      query = {
        data: {
          name,
          user: {
            connect: {
              id: user.id,
            },
          },
          parent: {
            connect: {
              id: parent,
            },
          },
        },
      };

    const folder = await prisma.folders.create(query);
    res.send(folder);
  }

  private trimLevel = (
    folders: any[],
    startIndex: number,
    level: number,
  ) => {
    const lvlArray: any[] = [];
    let i = startIndex;
    while (i < folders.length && folders[i].lvl === level) {
      lvlArray.push(folders[i]);
      i++;
    }
    return { array: lvlArray, index: i + 1 };
  };

  /// phase 3 : refactor
  private creatTree = (folders: any[]) => {
    const maxLevel = folders.at(-1).lvl;
    let res: any = {
      ...folders[0],
    };
    if (maxLevel < 2) return res;
    const { array, index } = this.trimLevel(folders, 1, 2);
    res.children = [...array];
    for (let i = 3; i < maxLevel; i++) {
      const { array: a1, index: i1 } = this.trimLevel(folders, index, i);
      for (let j = 0; j < a1.length; j++) {}
    }
    return res;
  };

  folderTree = async (
    req: ValidatedRequest<IFolderDetailSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    /// files should be included
    const folders: any[] =
      await prisma.$queryRaw`with recursive foldertree as (
        select name, id, "parentId", 1 as lvl
        from folder where id = ${id} AND "usersId" = ${user.id}
        Union
        select f.name, f.id, f."parentId" , ft.lvl + 1 as lvl
        from foldertree ft join folder f on ft.id = f."parentId"
      ) select * from foldertree`;

    /// create tree object
    const tree = this.creatTree(folders);

    res.send({ folders: tree });
  };
}

export const folderController = new FolderController();
