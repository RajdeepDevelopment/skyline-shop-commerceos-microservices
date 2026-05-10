import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@app/auth';
import { GrpcModule } from '@app/grpc';
import { MessagingModule } from '@app/messaging';
import { DatabaseModule } from '@app/database';
import { HealthModule } from '@app/common';
import { ApiGatewayController } from './api-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GrpcModule,
    MessagingModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
