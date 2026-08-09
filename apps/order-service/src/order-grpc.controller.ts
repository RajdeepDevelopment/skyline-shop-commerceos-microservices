import { Controller, Inject, ConflictException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaClient } from '@app/database';
import { OutboxService } from '@app/common/outbox/outbox.service';
import { OrderEvents } from '@app/common/events';
import { OrderSagaOrchestrator } from './saga/order-saga.orchestrator';
import * as crypto from 'crypto';

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Order gRPC Controller with idempotency protection.
 *
 * Uses Transactional Outbox for reliable event publishing.
 * Idempotency keys prevent duplicate order creation from retried requests.
 */
@Controller()
export class OrderGrpcController {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly outbox: OutboxService,
    private readonly saga: OrderSagaOrchestrator,
  ) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    shippingAddress: string;
    idempotencyKey?: string;
    paymentMethod?: string;
  }) {
    const idempotencyKey = data.idempotencyKey || this.generateIdempotencyKey(data);
    const requestHash = this.hashRequest(data);

    // Check for existing idempotency key
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });

    if (existing) {
      // Verify request hasn't changed (same payload = safe to retry)
      if (existing.requestHash !== requestHash) {
        throw new ConflictException('Idempotency key reused with different request payload');
      }

      // Return cached response if already completed
      if (existing.status === 'completed' && existing.response) {
        return existing.response as any;
      }

      // If still pending (race condition), wait briefly and check again
      if (existing.status === 'pending') {
        await this.sleep(100);
        const recheck = await this.prisma.idempotencyKey.findUnique({
          where: { key: idempotencyKey },
        });
        if (recheck?.status === 'completed' && recheck.response) {
          return recheck.response as any;
        }
        throw new ConflictException('Order is still being processed');
      }
    }

    // Create idempotency key record
    await this.prisma.idempotencyKey.create({
      data: {
        key: idempotencyKey,
        requestHash,
        status: 'pending',
        expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
      },
    });

    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      // Transactional outbox: order + outbox record in same DB transaction
      const order = await this.prisma.$transaction(async (tx) => {
        const createdOrder = await (tx as any).order.create({
          data: {
            totalAmount,
            shippingAddress: data.shippingAddress,
            idempotencyKey,
            user: {
              connectOrCreate: {
                where: { id: data.userId },
                create: {
                  id: data.userId,
                  email: `${data.userId}@guest.local`,
                  name: 'Guest',
                  passwordHash: 'guest',
                },
              },
            },
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
              })),
            },
            payment: {
              create: {
                amount: totalAmount,
                currency: 'INR',
                status: 'PENDING',
                paymentMethod: data.paymentMethod || 'upi',
              },
            },
          },
          include: { items: true },
        });

        await this.outbox.appendToTx(tx, {
          aggregateType: 'Order',
          aggregateId: createdOrder.id,
          eventType: OrderEvents.CREATED,
          payload: {
            orderId: createdOrder.id,
            userId: data.userId,
            items: data.items,
            totalAmount,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod || 'upi',
            idempotencyKey,
          },
        });

        return createdOrder;
      });

      const response = {
        orderId: order.id,
        status: order.status,
        totalAmount: Number(order.totalAmount),
      };

      // Cache the response for idempotency
      await this.prisma.idempotencyKey.update({
        where: { key: idempotencyKey },
        data: { status: 'completed', response },
      });

      // Fire-and-forget: saga runs asynchronously after commit
      this.saga
        .execute({
          orderId: order.id,
          userId: data.userId,
          items: data.items,
          totalAmount,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod || 'upi',
        })
        .catch((err) => {
          console.error(`Saga execution failed for order ${order.id}:`, err);
        });

      return response;
    } catch (error) {
      // Mark idempotency key as failed so retries can proceed
      await this.prisma.idempotencyKey.update({
        where: { key: idempotencyKey },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(data: { orderId: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: { items: true },
    });

    if (!order) {
      throw new RpcException({ code: 5, message: `Order ${data.orderId} not found` });
    }

    return {
      orderId: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.unitPrice),
      })),
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      shippingAddress: order.shippingAddress,
    };
  }

  @GrpcMethod('OrderService', 'GetUserOrders')
  async getUserOrders(data: { userId: string; page: number; pageSize: number }) {
    const page = data.page || 1;
    const pageSize = data.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId: data.userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.order.count({
        where: { userId: data.userId },
      }),
    ]);

    return {
      orders: orders.map((order) => ({
        orderId: order.id,
        userId: order.userId,
        status: order.status,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.unitPrice),
        })),
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        shippingAddress: order.shippingAddress,
      })),
      total,
    };
  }

  private generateIdempotencyKey(data: any): string {
    const payload = JSON.stringify({
      userId: data.userId,
      items: data.items,
      shippingAddress: data.shippingAddress,
      timestamp: Math.floor(Date.now() / 60000), // Changes every minute
    });
    return `order_${crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)}`;
  }

  private hashRequest(data: any): string {
    const payload = JSON.stringify({
      userId: data.userId,
      items: data.items,
      shippingAddress: data.shippingAddress,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
