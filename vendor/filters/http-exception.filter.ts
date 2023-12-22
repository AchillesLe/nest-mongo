import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from '../interfaces/error.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      error: exception.name || 'ServerError',
    };

    if (typeof exception.response == 'string') {
      errorResponse.message = exception.response;
    } else {
      Object.assign(errorResponse, exception.response);
    }

    response.status(status).json(errorResponse);
  }
}
