import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, route } = req;
    const routePath = route?.path || req.url;
    const start = Date.now();

    this.metrics.activeConnections.inc({ service: process.env.SERVICE_NAME || 'unknown' });

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - start) / 1000;
        const statusCode = res.statusCode;
        const serviceName = process.env.SERVICE_NAME || 'unknown';

        this.metrics.httpRequestsTotal.inc({
          method,
          route: routePath,
          status_code: statusCode,
          service: serviceName,
        });

        this.metrics.httpRequestDuration.observe(
          { method, route: routePath, status_code: statusCode, service: serviceName },
          duration,
        );

        this.metrics.activeConnections.dec({ service: serviceName });
      }),
    );
  }
}
