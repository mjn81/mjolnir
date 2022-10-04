import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { MESSAGES } from '../constants';
import { SingleValidationError, ValidationError } from '../errors';
import { createToken, hashVerify, hash } from '../utils';
import { prisma } from '../database';
import { ILoginSchema, IRegisterSchema } from '../schemas';

class AuthController {
  async login(req: ValidatedRequest<ILoginSchema>, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        fullName: true,
        role: true,
        password: true,
        usage: {
          select: {
            limit: true,
            used: true,
          },
        },
      },
    });
    const verify = await hashVerify(user.password, password);

    if (!verify)
      throw new ValidationError(MESSAGES['WRONG_PASSWORD'], 'password');

    const token = createToken({
      username: user.userName,
      id: user.id,
    });
    const { password: _, ...rest } = user;
    res.json({
      message: MESSAGES['LOGIN_SUCCESS'],
      token,
      user: rest,
    });
  }

  async register(req: ValidatedRequest<IRegisterSchema>, res: Response) {
    const { fullName, userName, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) throw new SingleValidationError(MESSAGES['USER_EXISTS']);

    const hashedPassword = await hash(password);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        userName,
        email,
        password: hashedPassword,
        usage: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        userName: true,
        fullName: true,
        role: true,
        usage: {
          select: {
            limit: true,
            used: true,
          },
        },
      },
    });

    const token = createToken({
      username: newUser.userName,
      id: newUser.id,
    });

    res.json({
      message: MESSAGES['REGISTER_SUCCESS'],
      token,
      user: newUser,
    });
  }
}

export const authController = new AuthController();
