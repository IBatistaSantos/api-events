import { BaseError } from '@/shared/domain/errors/base-errors';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(BaseError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.statusCode || 500;

    response.status(status).json({
      statusCode: status,
      error: exception.error,
      message: exception.message,
    });
  }
}
