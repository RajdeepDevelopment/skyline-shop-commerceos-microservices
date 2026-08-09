import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);

  // NATS transport for events (non-fatal)
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
        queue: 'inventory-service',
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

  const port = process.env.INVENTORY_SERVICE_PORT || 3004;
  await app.listen(port);
  console.log(`✅ Inventory Service running on port ${port}`);
}
void bootstrap();
