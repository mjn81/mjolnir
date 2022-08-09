import fileUpload from 'express-fileupload';
import { v4 } from 'uuid';
import path from 'path';

export const uploadController = async (
  req,
  res,
) => {
  if (
    !req.files ||
    Object.keys(req.files).length === 0
  ) {
    return res
      .status(400)
      .send('No files were uploaded.');
  }
  const file = req.files
    .file as fileUpload.UploadedFile;
  const filename = v4() + file.name;
  const uploadPath = path.resolve(
    __dirname,
    '..',
    '..',
    'uploads',
    filename,
  );
  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'File uploaded!' });
  });
};

export const playgroundController = (_, res) => {
  res.send({ message: 'Hello World' });
};
