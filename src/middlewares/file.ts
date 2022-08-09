import fileUpload from 'express-fileupload';
import path from 'path';

export const uploadeMiddleware = fileUpload({
  debug: true,
  limits: {
    fileSize: 100000000,
    fieldNameSize: 100,
  },
  useTempFiles: true,
  tempFileDir: path.resolve(
    __dirname,
    '..',
    '..',
    'tmp',
  ),
});
