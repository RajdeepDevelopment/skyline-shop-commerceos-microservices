import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@app/database';
import { ClientProxy } from '@nestjs/microservices';
import { OutboxService } from '@app/common/outbox/outbox.service';
import { OrderEvents, InventoryEvents, PaymentEvents } from '@app/common/events';
import { randomUUID } from 'crypto';

export enum SagaStep {
  PENDING = 'PENDING',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  COMPLETED = 'COMPLETED',
  COMPENSATING = 'COMPENSATING',
  FAILED = 'FAILED',
}

export interface OrderSagaData {
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

/**
 * Order Saga Orchestrator.
 *
 * Coordinates the distributed order creation workflow:
 *   1. Create order (PENDING)
 *   2. Reserve inventory (gRPC)
 *   3. Process payment (gRPC)
 *   4. Confirm order
 *
 * On any step failure, compensating actions are executed:
 *   - Release inventory if reserved
 *   - Cancel order
 *   - Publish failure events
 *
 * Uses the Transactional Outbox pattern for reliable event publishing.
 *
 * In production with a service mesh, prefer choreography-based saga
 * (events驱动) over orchestration for better resilience.
 * This orchestrator is the transitional approach.
 */
@Injectable()
export class OrderSagaOrchestrator {
  private readonly logger = new Logger(OrderSagaOrchestrator.name);

  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly outbox: OutboxService,
  ) {}

  /**
   * Execute the order creation saga.
   * Called by the gRPC controller after initial order persistence.
   */
  async execute(data: OrderSagaData): Promise<void> {
    const { orderId, userId, items, totalAmount, shippingAddress, paymentMethod } = data;

    this.logger.log(`Saga START for order ${orderId}`);

    // Step 1: Create order in PENDING state (already done by caller)
    // Step 2: Reserve inventory
    try {
      await this.reserveInventory(orderId, items);
      this.logger.log(`Saga step INVENTORY_RESERVED for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Saga step INVENTORY_FAILED for order ${orderId}: ${(error as Error).message}`,
      );
      await this.compensateOrder(orderId, 'INVENTORY_FAILED');
      return;
    }

    // Step 3: Process payment
    try {
      await this.processPayment(orderId, userId, totalAmount, paymentMethod);
      this.logger.log(`Saga step PAYMENT_PROCESSED for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Saga step PAYMENT_FAILED for order ${orderId}: ${(error as Error).message}`,
      );
      await this.compensateOrder(orderId, 'PAYMENT_FAILED');
      return;
    }

    // Step 4: Confirm order
    await this.confirmOrder(orderId);
    this.logger.log(`Saga COMPLETE for order ${orderId}`);
  }

  private async reserveInventory(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    // Publish inventory reservation request via NATS
    // In a real implementation, this would be a request-reply pattern
    // For now, we simulate via event publishing
    await this.outbox.append({
      aggregateType: 'Order',
      aggregateId: orderId,
      eventType: InventoryEvents.RESERVED,
      payload: {
        orderId,
        items,
        correlationId: orderId,
      },
    });
  }

  private async processPayment(
    orderId: string,
    userId: string,
    totalAmount: number,
    paymentMethod: string,
  ): Promise<void> {
    await this.outbox.append({
      aggregateType: 'Order',
      aggregateId: orderId,
      eventType: PaymentEvents.SUCCESS,
      payload: {
        orderId,
        userId,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod,
        correlationId: orderId,
      },
    });
  }

  private async confirmOrder(orderId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await (tx as any).order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      await this.outbox.appendToTx(tx, {
        aggregateType: 'Order',
        aggregateId: orderId,
        eventType: OrderEvents.CONFIRMED,
        payload: { orderId, status: 'CONFIRMED' },
      });
    });
  }

  /**
   * Compensating transaction for failed saga steps.
   * Reverses completed steps in reverse order.
   */
  private async compensateOrder(orderId: string, reason: string): Promise<void> {
    this.logger.warn(`Saga COMPENSATING for order ${orderId}: ${reason}`);

    await this.prisma.$transaction(async (tx) => {
      // Release inventory if it was reserved
      await this.outbox.appendToTx(tx, {
        aggregateType: 'Order',
        aggregateId: orderId,
        eventType: InventoryEvents.RELEASED,
        payload: { orderId, reason, correlationId: orderId },
      });

      // Cancel the order
      await (tx as any).order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      // Publish cancellation event
      await this.outbox.appendToTx(tx, {
        aggregateType: 'Order',
        aggregateId: orderId,
        eventType: OrderEvents.CANCELLED,
        payload: { orderId, reason, status: 'CANCELLED' },
      });
    });
  }
}
