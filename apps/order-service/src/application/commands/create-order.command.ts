import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@app/database';
import { EventBusService } from '@app/messaging/event-bus.service';
import { OrderEvents, OrderCreatedEvent } from '@app/common';

export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: Array<{ productId: string; quantity: number; price: number }>,
    public readonly shippingAddress: string,
  ) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{ success: boolean; orderId: string }> {
    const { userId, items, shippingAddress } = command;

    // 1. Calculate total amount
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 2. Create Order in PENDING status within a transaction
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        totalAmount,
        shippingAddress,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
    });

    // 3. Publish OrderCreatedEvent
    const event: OrderCreatedEvent = {
      orderId: order.id,
      userId,
      items,
      totalAmount,
    };

    await this.eventBus.publish(OrderEvents.CREATED, event);

    console.log(`Order created and event published: ${order.id}`);

    return { success: true, orderId: order.id };
  }
}
