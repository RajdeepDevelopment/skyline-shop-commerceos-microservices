import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@app/grpc';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'order';
  const app = await NestFactory.create(OrderServiceModule);

  // gRPC microservice transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.GRPC_ORDER_URL?.split(':')[1] ?? '50056'}`,
      package: 'order',
      protoPath: PROTO_PATHS.ORDER,
    },
  });

  // NATS transport for events (non-fatal)
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
        queue: 'order-service',
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

  const port = process.env.ORDER_SERVICE_PORT || 3006;
  await app.listen(port);
  console.log(`✅ Order Service running on port ${port}`);
}
void bootstrap();
