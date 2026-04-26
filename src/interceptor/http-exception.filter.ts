import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(HttpException, Prisma.PrismaClientKnownRequestError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An Internal Server Error Occured';
    let errorType = 'InternalServerError';
    let fieldErrors: Record<string, string[]> | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorType = exception.name;

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const exceptionResponseRecord = exceptionResponse as Record<
          string,
          unknown
        >;
        message = (exceptionResponseRecord.message as string) || message;
        errorType = (exceptionResponseRecord.error as string) || errorType;
        fieldErrors =
          (exceptionResponseRecord.errors as Record<string, string[]>) || null;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // 1. P2025: Record Not Found
      // Triggers on: findUniqueOrThrow, update, delete
      if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'The requested resource was not found';
        errorType = 'NotFoundException';
      }

      // 2. P2002: Unique Constraint Violation
      // Triggers on: create/update when an @unique field (like email) already exists
      else if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT; // 409 Status Code
        message = 'A record with this unique attribute already exists';
        errorType = 'ConflictException';

        // Optional: Prisma includes the exact field that failed in the 'meta' object!
        // You can map this into your 'fieldErrors' object so the frontend knows exactly which input to highlight red.
        const target = (exception.meta?.target as string[]) || [];
        if (target.length > 0) {
          fieldErrors = { [target[0]]: ['This value is already taken'] };
        }
      }

      // 3. P2003: Foreign Key Constraint Violation
      // Triggers on: create/update when you pass a relation ID that doesn't exist (e.g., creating a Post for a userId that is deleted)
      else if (exception.code === 'P2003') {
        status = HttpStatus.UNPROCESSABLE_ENTITY; // 422 Status Code
        message = 'A related record required for this operation does not exist';
        errorType = 'UnprocessableEntityException';
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: errorType,
      ...(fieldErrors && { errors: fieldErrors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
