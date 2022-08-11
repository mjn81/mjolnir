import { ERROR_CODE } from '../constants';
import { CustomError } from './CustomError';

export class FileUploadError extends CustomError {
  errorCode = ERROR_CODE['FILE_UPLOAD_ERROR'];
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
