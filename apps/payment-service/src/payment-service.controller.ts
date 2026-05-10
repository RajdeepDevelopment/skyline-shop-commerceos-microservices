import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryEvents, PaymentEvents, StockReservedEvent } from '@app/common';
import { PaymentServiceService } from './payment-service.service';
import { EventBusService } from '@app/messaging/event-bus.service';

@Controller()
export class PaymentServiceController {
  constructor(
    private readonly paymentService: PaymentServiceService,
    private readonly eventBus: EventBusService,
  ) {}

  @EventPattern(InventoryEvents.RESERVED)
  async handleStockReserved(@Payload() data: StockReservedEvent) {
    console.log(`Received StockReservedEvent: ${data.orderId}`);

    // Simulate payment processing
    const success = await this.paymentService.processPayment(data.orderId);

    if (success) {
      await this.eventBus.publish(PaymentEvents.SUCCESS, {
        orderId: data.orderId,
        paymentId: 'pay_' + Math.random().toString(36).substring(7),
      });
      console.log(`Payment successful for order: ${data.orderId}`);
    } else {
      await this.eventBus.publish(PaymentEvents.FAILED, {
        orderId: data.orderId,
      });
      console.log(`Payment failed for order: ${data.orderId}`);
    }
  }
}
