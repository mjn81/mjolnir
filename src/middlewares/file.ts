import multer from 'multer';
import { uploadPath } from '../utils';

export const upload = multer({
  dest: uploadPath,
});
