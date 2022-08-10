import { Request, Response } from 'express';

import { MESSAGES } from '../constants';
import { SingleValidationError, ValidationError } from '../errors';
import {
  concat,
  createToken,
  hashVerify,
  hash,
} from '../utils';
import { prisma } from '../database';

// phase 2 : add refresh token
export const loginController = async (
  req: Request,
  res: Response,
) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ValidationError(
      MESSAGES['FIELD_EMPTY'],
      concat(['email', 'password']),
    );

  const user =
    await prisma.users.findUniqueOrThrow({
      where: {
        email,
      },
    });

  const verify = await hashVerify(
    user.password,
    password,
  );

  if (!verify)
    throw new ValidationError(
      MESSAGES['WRONG_PASSWORD'],
      'password',
    );

  const token = createToken({
    username: user.userName,
    id: user.id,
  });

  res.send({
    token,
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
    },
  });
};

export const registerController = async (
  req: Request,
  res: Response,
) => {
  const { fullName, userName, email, password } =
    req.body;
  if (
    !fullName ||
    !userName ||
    !email ||
    !password
  )
    throw new ValidationError(
      MESSAGES['FIELD_EMPTY'],
      concat([
        'fullName',
        'userName',
        'email',
        'password',
      ]),
    );

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (user)
    throw new SingleValidationError(
      MESSAGES['USER_EXISTS'],
    );

  const hashedPassword = await hash(password);

  const newUser = await prisma.users.create({
    data: {
      fullName,
      userName,
      email,
      password: hashedPassword,
    },
  });

  const token = createToken({
    username: newUser.userName,
    id: newUser.id,
  });

  res.send({
    token,
    user: {
      id: newUser.id,
      userName: newUser.userName,
      email: newUser.email,
    },
  });
};
