import { ERROR_CODE } from '../constants';
import { CustomError } from './CustomError';

export class TokenError extends CustomError {
  errorCode = ERROR_CODE['BAD_REQUEST'];
  errorType = 'TokenError';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(
      this,
      TokenError.prototype,
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

export class AuthorizationError extends CustomError {
  errorCode = ERROR_CODE['UNAUTHORIZED'];
  errorType = 'AuthorizationError';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(
      this,
      TokenError.prototype,
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
