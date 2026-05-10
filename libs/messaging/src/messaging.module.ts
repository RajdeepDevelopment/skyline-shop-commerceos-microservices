import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@app/common';

import { EventBusService } from './event-bus.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('NATS_URL', 'nats://localhost:4222')],
            queue: 'ecommerce_queue',
          },
        }),
      },
    ]),
    CommonModule,
  ],
  providers: [EventBusService],
  exports: [ClientsModule, EventBusService],
})
export class MessagingModule {}
