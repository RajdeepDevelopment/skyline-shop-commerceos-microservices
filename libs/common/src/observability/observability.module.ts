import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TelemetryModule } from '@app/telemetry';
import { LoggerModule } from '@app/logger';
import { MetricsModule } from '../metrics/metrics.module';
import { MetricsController } from './metrics.controller';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { MetricsInterceptor } from '../interceptors/metrics.interceptor';

@Global()
@Module({
  imports: [TelemetryModule, LoggerModule, MetricsModule],
  controllers: [MetricsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [MetricsModule],
})
export class ObservabilityModule {}
