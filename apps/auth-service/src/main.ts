import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { PROTO_PATHS } from '@app/grpc';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'auth';
  // HTTP server for REST + Swagger
  const app = await NestFactory.create(AuthServiceModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // gRPC microservice transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.GRPC_AUTH_URL?.split(':')[1] ?? '50051'}`,
      package: 'auth',
      protoPath: PROTO_PATHS.AUTH,
    },
  });

  // NATS transport for events (non-fatal — service runs HTTP+gRPC even if NATS is down)
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
        queue: 'auth-service',
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

  const port = parseInt(process.env.AUTH_SERVICE_PORT ?? '3001', 10);
  await app.listen(port);

  console.log(`✅ Auth Service running on port ${port}`);
}
void bootstrap();
