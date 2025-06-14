import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { ENV } from '@src/env';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (ENV.isDevelopment || ENV.isStaging) {
      console.info('🚀😬 ~ ExceptionFilter ~ exception:', exception);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode: number;
    let errorMessages: string[] = [exception.message];

    if (exception instanceof TypeError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (exception.message) {
        errorMessages = [exception.message];
      } else {
        errorMessages = ['Internal Server Error'];
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();
      if (exception instanceof ForbiddenException) {
        errorMessages = ['Unauthorized request'];
      } else if (
        exception?.message &&
        exception.message.includes('violates foreign key constraint')
      ) {
        const field = (exception.getResponse() as object as any)?.detail
          ?.split('Key (')[1]
          .split(')')[0];
        errorMessages = [`${field || ''} not found`];
        statusCode = HttpStatus.CONFLICT;
      } else {
        errorMessages = typeof res.message === 'string' ? [res.message] : res.message;
      }
    } else {
      if (
        exception?.message &&
        exception.message.includes('duplicate key value violates unique constraint')
      ) {
        const field = exception?.detail?.split('Key (')[1].split(')')[0];
        errorMessages = [`${field || ''} already exists`];
        statusCode = HttpStatus.CONFLICT;
      } else if (exception?.message && exception.message.includes('null value in column')) {
        const field = exception.column;
        errorMessages = [`${field} is required`];
        statusCode = HttpStatus.BAD_REQUEST;
      }
      errorMessages = errorMessages ? errorMessages : ['Internal Server Error'];
      statusCode = statusCode ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const res = {
      success: false,
      statusCode: statusCode,
      message:
        Array.isArray(errorMessages) && errorMessages?.length
          ? errorMessages[0]
          : 'something went wrong',
      errorMessages,
    };
    response.status(statusCode).json(res);
  }
}
