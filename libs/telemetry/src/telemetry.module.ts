import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelemetryService } from './telemetry.service';

@Global()
@Module({
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule implements OnModuleInit {
  constructor(
    private readonly telemetry: TelemetryService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.config.get<string>('OTEL_ENABLED', 'true') === 'true') {
      await this.telemetry.init();
    }
  }
}
