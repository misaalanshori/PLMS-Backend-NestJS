import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response as ExpressResponse } from 'express';

export interface Response {
  statusCode: number;
  message: string;
  data: any;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response | void
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response | void> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res: unknown) => {
        // handle No Content
        if (statusCode == 204) return;

        // if res is an expected object we format the envelope
        if (typeof res === 'object' && res !== null) {
          const resRecord = res as Record<string, unknown>;
          console.log(res, resRecord);

          // for handling meta fields (like pagination)
          if ('meta' in resRecord) {
            return {
              statusCode,
              message: (resRecord.message as string) || 'Request Success',
              data: resRecord.data,
              meta: resRecord.meta,
            };
          }

          // for handling responses without meta
          return {
            statusCode,
            message: (resRecord.message as string) || 'Request Success',
            data: resRecord.data || res,
          };
        }

        // for handling responses that are not objects
        return {
          statusCode,
          message: 'Request Success',
          data: res,
        };
      }),
    );
  }
}
