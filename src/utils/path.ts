import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../constants';

export const rootPath = path.resolve(
  __dirname,
  '..',
  '..',
);
export const uploadPath = path.resolve(
  rootPath,
  UPLOAD_DIR,
);

export const pathExist = (
  path: string,
): boolean => {
  return fs.existsSync(path);
};
