import { Module } from '@nestjs/common';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from '@app/messaging';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MessagingModule,
    CommonModule,
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
