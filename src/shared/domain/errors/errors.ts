import { BaseError } from './base-errors';

export class BadException extends BaseError {
  constructor(message: string) {
    super(message, 400, 'BadRequest');
  }
}

export class NotFoundException extends BaseError {
  constructor(message: string) {
    super(message, 404, 'NotFound');
  }
}

export class UnauthorizedException extends BaseError {
  constructor(message: string) {
    super(message, 401, 'Unauthorized');
  }
}

export class ForbiddenException extends BaseError {
  constructor(message: string) {
    super(message, 403, 'Forbidden');
  }
}

export class TokenExpiredException extends BaseError {
  constructor(message: string) {
    super(message, 401, 'TokenExpired');
  }
}
