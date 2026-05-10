import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);

  // NATS transport for events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
      queue: 'inventory-service',
    },
  });

  await app.startAllMicroservices();

  const port = process.env.INVENTORY_SERVICE_PORT || 3004;
  await app.listen(port);
  console.log(`✅ Inventory Service running on port ${port}`);
}
void bootstrap();
