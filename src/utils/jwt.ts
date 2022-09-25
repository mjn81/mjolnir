import jwt from 'jsonwebtoken';

// phase 3 : add defualt secret
export const createToken = (payload: { username: string; id: string }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return `Token ${token}`;
};

export const createDistToken = (payload: {
  username: string;
  id: string;
}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? 'secret');
  return `Token ${token}`;
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
    if (typeof payload === 'string') return null;
    return payload;
  } catch (error) {
    // phase 3 : logger + further checking
    console.log(error);
    return null;
  }
};
