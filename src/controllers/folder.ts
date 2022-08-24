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

  create = async (
    req: ValidatedRequest<IFolderCreateSchema>,
    res: Response,
  ) => {
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
  };

  private trimLevel = (folders: any[], level: number) => {
    const lvlArray: any[] = [];
    let i = folders.length - 1;
    while (i > 0 || folders[i].lvl === level) {
      if (folders[i].lvl === level) {
        lvlArray.push(folders[i]);
      }
      i--;
    }
    return { array: lvlArray, index: i - 1 };
  };

  /// phase 3 : refactor
  private creatTree = (folders: any[]) => {
    const maxLevel = folders.at(-1).lvl;
    let res: any = {
      ...folders[0],
    };
    if (maxLevel < 2) return res;
    const { array } = this.trimLevel(folders, 2);
    res.children = [...array];
    if (maxLevel < 3) return res;
    let chl: any[] = [];
    for (let i = maxLevel; i > 2; i--) {
      const { array: a1 } = this.trimLevel(folders, i - 1);
      for (let j = a1.length - 1; j > -1; j--) {
        const { array: a2 } = this.trimLevel(folders, i);
        a1[j].children = a2.filter(
          (folder) => folder.parentId == a1[j].id,
        );
      }
      chl =
        chl.length === 0
          ? a1
          : a1.map((level2) => {
              const children = level2.children?.map((level3) => {
                return chl.filter((level34) => level34.id == level3.id)[0];
              });
              level2.children = children;
              return level2;
            });
    }
    res.children = chl;
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

  subFolder = async (
    req: ValidatedRequest<IFolderDetailSchema>,
    res: Response,
  ) => {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    const rootFolder = await prisma.folders.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    const subFolders = await prisma.folders.findMany({
      where: {
        AND: {
          parent: {
            id: id,
          },
          user: {
            id: user.id,
          },
        },
      },
    });

    return res.send({
      ...rootFolder,
      children: subFolders,
    });
  };
}

export const folderController = new FolderController();
