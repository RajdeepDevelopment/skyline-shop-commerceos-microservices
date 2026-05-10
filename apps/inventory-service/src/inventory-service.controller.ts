import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderEvents, OrderCreatedEvent, InventoryEvents } from '@app/common';
import { InventoryServiceService } from './inventory-service.service';
import { EventBusService } from '@app/messaging/event-bus.service';

@Controller()
export class InventoryServiceController {
  constructor(
    private readonly inventoryService: InventoryServiceService,
    private readonly eventBus: EventBusService,
  ) {}

  @EventPattern(OrderEvents.CREATED)
  async handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    console.log(`Received OrderCreatedEvent: ${data.orderId}`);

    // Simulate stock reservation
    const success = await this.inventoryService.reserveStock(data.items);

    if (success) {
      await this.eventBus.publish(InventoryEvents.RESERVED, {
        orderId: data.orderId,
        userId: data.userId,
      });
      console.log(`Stock reserved for order: ${data.orderId}`);
    } else {
      await this.eventBus.publish(InventoryEvents.OUT_OF_STOCK, {
        orderId: data.orderId,
      });
      console.log(`Stock reservation failed for order: ${data.orderId}`);
    }
  }
}
