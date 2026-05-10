import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

export interface LogContext {
  correlationId?: string;
  service?: string;
  [key: string]: unknown;
}

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(service = 'ecommerce') {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
      formatters: {
        level: (label: string) => ({ level: label }),
      },
      base: { service },
    });
  }

  log(message: any, ...optionalParams: any[]): void {
    this.logger.info({ context: optionalParams[0] }, message);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.logger.error({ context: optionalParams[1], trace: optionalParams[0] }, message);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn({ context: optionalParams[0] }, message);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.logger.debug({ context: optionalParams[0] }, message);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.logger.trace({ context: optionalParams[0] }, message);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    this.logger.fatal({ context: optionalParams[0] }, message);
  }

  /**
   * Create a child logger with bound correlationId for request tracing.
   */
  withCorrelationId(correlationId: string): pino.Logger {
    return this.logger.child({ correlationId });
  }
}
