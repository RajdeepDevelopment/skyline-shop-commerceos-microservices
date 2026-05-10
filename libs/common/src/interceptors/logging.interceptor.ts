import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLoggerService } from '@app/logger';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const correlationId = req.headers[CORRELATION_ID_HEADER] as string;
    const { method, url } = req;
    const start = Date.now();

    this.logger.log(`--> ${method} ${url}`, { correlationId });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`<-- ${method} ${url} ${res.statusCode} ${duration}ms`, {
          correlationId,
          duration,
          statusCode: res.statusCode,
        });
      }),
    );
  }
}
