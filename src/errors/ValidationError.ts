import { ERROR_CODE } from '../constants';
import { CustomError } from './CustomError';

export class ValidationError extends CustomError {
  errorCode = ERROR_CODE['BAD_REQUEST'];
  errorType = 'VALIDATION_ERROR';

  constructor(
    message: string,
    private property: string,
  ) {
    super(message);
    Object.setPrototypeOf(
      this,
      ValidationError.prototype,
    );
  }

  serializeErrors() {
    return [
      {
        message: this.message,
        property: this.property,
      },
    ];
  }
}

export class SingleValidationError extends CustomError {
  errorCode = ERROR_CODE['BAD_REQUEST'];
  errorType = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(
      this,
      ValidationError.prototype,
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
