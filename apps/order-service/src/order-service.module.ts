import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderGrpcController } from './order-grpc.controller';
import { OrderServiceService } from './order-service.service';
import { OrderSagaOrchestrator } from './saga/order-saga.orchestrator';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from '@app/messaging';
import { OutboxModule } from '@app/common/outbox/outbox.module';
import { LivenessModule, ObservabilityModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    LivenessModule,
    DatabaseModule,
    MessagingModule,
    OutboxModule,
  ],
  controllers: [OrderServiceController, OrderGrpcController],
  providers: [OrderServiceService, OrderSagaOrchestrator],
})
export class OrderServiceModule {}
