import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AnalyticsServiceModule } from './analytics-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsServiceModule);

  // NATS transport for behaviour events (non-fatal)
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
        queue: 'analytics-service',
      },
    });
  } catch (error) {
    console.warn(`⚠ NATS unavailable, running without event bus: ${(error as Error).message}`);
  }

  try {
    await app.startAllMicroservices();
  } catch (error) {
    console.warn(`⚠ Microservice start error (NATS may be down): ${(error as Error).message}`);
  }

  const port = process.env.ANALYTICS_SERVICE_PORT || 3008;
  await app.listen(port);
  console.log(`✅ Analytics Service running on port ${port}`);
}
void bootstrap();
