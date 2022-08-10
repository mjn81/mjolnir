import { CustomError } from './CustomError';

export class ServerError extends CustomError {
  errorCode = 400;
  errorType = 'SERVER_ERROR';
  constructor(messgae: string) {
    super(messgae);
    Object.setPrototypeOf(
      this,
      ServerError.prototype,
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
