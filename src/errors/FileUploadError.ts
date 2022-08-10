import { CustomError } from './CustomError';

export class FileUploadError extends CustomError {
  errorCode = 400;
  errorType = 'FILE_UPLOAD_ERROR';
  constructor(messgae: string) {
    super(messgae);
    Object.setPrototypeOf(
      this,
      FileUploadError.prototype,
    );
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
