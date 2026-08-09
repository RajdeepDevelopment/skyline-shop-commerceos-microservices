import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@app/database';
import { LivenessModule, ObservabilityModule } from '@app/common';
import { MessagingModule } from '@app/messaging';
import { AvailabilityServiceController } from './availability-service.controller';
import { AvailabilityServiceService } from './availability-service.service';
import { RedisService } from './redis.service';
import { ReservationScheduler } from './reservation.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    MessagingModule,
    LivenessModule,
    ObservabilityModule,
  ],
  controllers: [AvailabilityServiceController],
  providers: [AvailabilityServiceService, RedisService, ReservationScheduler],
})
export class AvailabilityServiceModule {}
