import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);

  // NATS transport for events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
      queue: 'payment-service',
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PAYMENT_SERVICE_PORT || 3007;
  await app.listen(port);
  console.log(`✅ Payment Service running on port ${port}`);
}
void bootstrap();
