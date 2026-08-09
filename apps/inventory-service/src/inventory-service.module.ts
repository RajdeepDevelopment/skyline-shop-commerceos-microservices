import { Module } from '@nestjs/common';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from '@app/messaging';
import { LivenessModule, ObservabilityModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    LivenessModule,
    DatabaseModule,
    MessagingModule,
  ],
  controllers: [InventoryServiceController],
  providers: [InventoryServiceService],
})
export class InventoryServiceModule {}
