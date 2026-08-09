import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@app/database';
import { ClientProxy } from '@nestjs/microservices';

export interface OutboxMessage {
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Outbox Pattern implementation.
 *
 * Ensures reliable event publishing by writing events to an outbox table
 * in the same database transaction as the business write. A background
 * publisher polls the outbox and forwards events to NATS JetStream.
 *
 * This guarantees:
 * - No lost events (transactional outbox)
 * - At-least-once delivery with idempotent consumers
 * - Decoupling between write operations and event publishing
 *
 * Outbox table schema:
 *   CREATE TABLE outbox_messages (
 *     id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     aggregate_type TEXT NOT NULL,
 *     aggregate_id  TEXT NOT NULL,
 *     event_type    TEXT NOT NULL,
 *     payload       JSONB NOT NULL,
 *     metadata      JSONB,
 *     published     BOOLEAN DEFAULT FALSE,
 *     created_at    TIMESTAMPTZ DEFAULT NOW(),
 *     published_at  TIMESTAMPTZ
 *   );
 *   CREATE INDEX idx_outbox_unpublished ON outbox_messages (created_at)
 *     WHERE published = FALSE;
 */
@Injectable()
export class OutboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxService.name);
  private isPublishing = false;
  private publishInterval: ReturnType<typeof setInterval> | null = null;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  onModuleInit() {
    this.logger.log('Outbox publisher initialized');
    // Poll unpublishsed outbox messages every 2 seconds
    this.publishInterval = setInterval(() => this.publishPendingEvents(), 2000);
    // Cleanup old published messages every 24 hours
    this.cleanupInterval = setInterval(() => this.cleanupOldMessages(), 24 * 60 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.publishInterval) clearInterval(this.publishInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
  }

  /**
   * Store an outbox message within an existing Prisma transaction client.
   * Call this inside a $transaction callback to guarantee atomicity.
   *
   * @example
   * await prisma.$transaction(async (tx) => {
   *   const order = await tx.order.create({ data: { ... } });
   *   await outboxService.appendToTx(tx, {
   *     aggregateType: 'Order',
   *     aggregateId: order.id,
   *     eventType: OrderEvents.CREATED,
   *     payload: { orderId: order.id, userId: order.userId, items: [...] },
   *   });
   * });
   */
  async appendToTx(txClient: any, message: OutboxMessage): Promise<void> {
    await txClient.outboxMessage.create({
      data: {
        aggregateType: message.aggregateType,
        aggregateId: message.aggregateId,
        eventType: message.eventType,
        payload: message.payload,
        metadata: message.metadata ?? {},
      },
    });
  }

  /**
   * Direct write (not in a transaction) for convenience.
   */
  async append(message: OutboxMessage): Promise<void> {
    await (this.prisma as any).outboxMessage.create({
      data: {
        aggregateType: message.aggregateType,
        aggregateId: message.aggregateId,
        eventType: message.eventType,
        payload: message.payload,
        metadata: message.metadata ?? {},
      },
    });
  }

  /**
   * Background publisher that polls unpublishsed outbox messages
   * and sends them to NATS JetStream. Runs every 2 seconds.
   */
  async publishPendingEvents(): Promise<void> {
    if (this.isPublishing) return;
    this.isPublishing = true;

    try {
      const messages = await (this.prisma as any).outboxMessage.findMany({
        where: { published: false },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });

      for (const msg of messages) {
        try {
          this.natsClient.emit(msg.eventType, msg.payload);

          await (this.prisma as any).outboxMessage.update({
            where: { id: msg.id },
            data: { published: true, publishedAt: new Date() },
          });

          this.logger.debug(`Published outbox event: ${msg.eventType} [${msg.aggregateId}]`);
        } catch (error) {
          this.logger.error(
            `Failed to publish outbox event ${msg.eventType}: ${(error as Error).message}`,
          );
          // Leave as unpublished for retry on next cycle
        }
      }
    } catch (error) {
      this.logger.error(`Outbox polling failed: ${(error as Error).message}`);
    } finally {
      this.isPublishing = false;
    }
  }

  /**
   * Cleanup old published messages (older than 7 days).
   * Runs daily.
   */
  async cleanupOldMessages(): Promise<void> {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);

      const result = await (this.prisma as any).outboxMessage.deleteMany({
        where: {
          published: true,
          publishedAt: { lt: cutoff },
        },
      });

      if (result.count > 0) {
        this.logger.log(`Cleaned up ${result.count} old outbox messages`);
      }
    } catch (error) {
      this.logger.error(`Outbox cleanup failed: ${(error as Error).message}`);
    }
  }
}
