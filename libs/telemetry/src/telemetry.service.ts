import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private initialized = false;

  constructor(private readonly config: ConfigService) {}

  async init() {
    if (this.initialized) return;

    try {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { getNodeAutoInstrumentations } =
        await import('@opentelemetry/auto-instrumentations-node');
      const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
      const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
      const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
      const { resourceFromAttributes } = await import('@opentelemetry/resources');

      const serviceName = this.config.get<string>('SERVICE_NAME', 'unknown');
      const serviceVersion = this.config.get<string>('SERVICE_VERSION', '1.0.0');
      const otelEndpoint = this.config.get<string>(
        'OTEL_EXPORTER_OTLP_ENDPOINT',
        'http://localhost:4318',
      );

      const traceExporter = new OTLPTraceExporter({
        url: `${otelEndpoint}/v1/traces`,
      });

      const metricExporter = new OTLPMetricExporter({
        url: `${otelEndpoint}/v1/metrics`,
      });

      const resource = resourceFromAttributes({
        'service.name': serviceName,
        'service.version': serviceVersion,
      });

      const sdk = new NodeSDK({
        resource,
        traceExporter,
        metricReader: new PeriodicExportingMetricReader({
          exporter: metricExporter,
          exportIntervalMillis: 15000,
        }),
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: true },
            '@opentelemetry/instrumentation-express': { enabled: true },
            '@opentelemetry/instrumentation-grpc': { enabled: true },
            '@opentelemetry/instrumentation-pg': { enabled: true },
            '@opentelemetry/instrumentation-redis': { enabled: true },
          }),
        ],
      });

      sdk.start();
      this.initialized = true;
      this.logger.log(`OpenTelemetry initialized for service: ${serviceName}`);

      process.on('SIGTERM', () => {
        sdk.shutdown().catch(() => this.logger.error('OpenTelemetry shutdown failed'));
      });
    } catch (error) {
      this.logger.warn(
        `OpenTelemetry not available, skipping initialization: ${(error as Error).message}`,
      );
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
