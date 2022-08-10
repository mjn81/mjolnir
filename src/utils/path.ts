import path from 'path';
import { v4 } from 'uuid';
import fs from 'fs';
import { UPLOAD_DIR } from '../constants';

export const rootPath = path.resolve(
  __dirname,
  '..',
  '..',
);

export const pathExist = (
  path: string,
): boolean => {
  return fs.existsSync(path);
};

export const createFilePath = (
  fileName: string,
): string => {
  const name = v4() + fileName;
  const uploadPath = path.resolve(
    rootPath,
    UPLOAD_DIR,
  );
  if (!pathExist(uploadPath))
    fs.mkdirSync(uploadPath);

  const filePath = path.resolve(uploadPath, name);
  return filePath;
};
