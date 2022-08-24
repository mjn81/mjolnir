import argon from 'argon2';

export const hashVerify = (hash: string, password: string) =>
  argon.verify(hash, password);

export const hash = (password: string) => argon.hash(password);
export const checkHash = (hash: string) => {
  const res = hash.match('$argon2id$');
  return res === null;
};
