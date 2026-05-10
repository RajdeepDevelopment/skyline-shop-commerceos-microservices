import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NOTIFICATION_QUEUE, SendEmailJob } from './queue.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<SendEmailJob>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id} (attempt ${job.attemptsMade + 1})`);

    const { to, subject, template, data } = job.data;

    try {
      // Here you'd call your email provider (SendGrid, SES, etc.)
      this.logger.log(`Sending email to ${to}: "${subject}" using template "${template}"`);
      this.logger.debug(`Email data: ${JSON.stringify(data)}`);

      // Simulated async email sending
      await Promise.resolve();

      this.logger.log(`✅ Email sent successfully to ${to} (job ${job.id})`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email for job ${job.id}`, error);
      throw error; // Re-throw so BullMQ applies retry backoff
    }
  }
}
