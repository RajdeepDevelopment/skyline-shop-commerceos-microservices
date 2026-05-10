import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from '@app/messaging';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, MessagingModule],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
