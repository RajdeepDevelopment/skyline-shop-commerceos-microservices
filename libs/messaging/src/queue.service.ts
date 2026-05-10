import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const NOTIFICATION_QUEUE = 'notifications';
export const ORDER_EVENTS_QUEUE = 'order-events';

export interface SendEmailJob {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export interface OrderEventJob {
  type: 'ORDER_CREATED' | 'ORDER_CANCELLED' | 'ORDER_SHIPPED';
  orderId: string;
  userId: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    @InjectQueue(ORDER_EVENTS_QUEUE) private readonly orderEventsQueue: Queue,
  ) {}

  /**
   * Enqueue an email notification job.
   * Retry strategy: 3 attempts with exponential backoff.
   * Idempotency: job ID derived from correlationId prevents duplicates.
   */
  async sendEmail(job: SendEmailJob, correlationId: string): Promise<void> {
    await this.notificationQueue.add('send-email', job, {
      jobId: `email-${correlationId}`, // Idempotency key
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: { count: 100 }, // Keep last 100 failed jobs for DLQ inspection
    });
  }

  /**
   * Publish an order domain event to the queue.
   * Dead-letter: failed jobs remain queryable for manual retry.
   */
  async publishOrderEvent(event: OrderEventJob, correlationId: string): Promise<void> {
    await this.orderEventsQueue.add(event.type, event, {
      jobId: `${event.type}-${event.orderId}-${correlationId}`,
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }
}
