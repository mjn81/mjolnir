import { ERROR_CODE } from '../constants';
import { CustomError } from './CustomError';

export class ServerError extends CustomError {
  errorCode = ERROR_CODE['INTERNAL_SERVER_ERROR'];
  errorType = 'SERVER_ERROR';
  constructor(messgae: string) {
    super(messgae);
    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
