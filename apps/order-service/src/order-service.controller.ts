import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentEvents, PaymentSuccessEvent } from '@app/common';
import { PrismaClient } from '@app/database';

@Controller()
export class OrderServiceController {
  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}

  @EventPattern(PaymentEvents.SUCCESS)
  async handlePaymentSuccess(@Payload() data: PaymentSuccessEvent) {
    console.log(`Received PaymentSuccessEvent for order: ${data.orderId}`);

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'CONFIRMED' },
    });

    console.log(`Order ${data.orderId} status updated to CONFIRMED`);
  }

  @EventPattern(PaymentEvents.FAILED)
  async handlePaymentFailed(@Payload() data: { orderId: string }) {
    console.log(`Received PaymentFailedEvent for order: ${data.orderId}`);

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'CANCELLED' },
    });

    console.log(`Order ${data.orderId} status updated to CANCELLED due to payment failure`);

    // Here you would also emit an event to Inventory Service to release stock
  }
}
