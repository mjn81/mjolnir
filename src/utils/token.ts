import jwt from 'jsonwebtoken';

// phase 2 : add defualt secret
export const createToken = (payload: {
  username: string;
  id: string;
}) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET ?? 'secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  return `Token ${token}`;
};
