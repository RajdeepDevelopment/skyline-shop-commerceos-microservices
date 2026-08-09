import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AvailabilityServiceService } from './availability-service.service';

@Injectable()
export class ReservationScheduler {
  private readonly logger = new Logger(ReservationScheduler.name);

  constructor(private readonly availabilityService: AvailabilityServiceService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations(): Promise<void> {
    try {
      const count = await this.availabilityService.expireReservations();
      if (count > 0) {
        this.logger.log(`Released ${count} expired reservation(s)`);
      }
    } catch (error) {
      this.logger.warn(`Reservation expiry sweep failed: ${(error as Error).message}`);
    }
  }
}
