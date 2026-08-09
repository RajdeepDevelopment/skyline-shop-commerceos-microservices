import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@app/auth';
import { GrpcModule } from '@app/grpc';
import { MessagingModule } from '@app/messaging';
import { DatabaseModule } from '@app/database';
import { LivenessModule, SearchModule, ObservabilityModule } from '@app/common';
import { ApiGatewayController } from './api-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    HttpModule,
    AuthModule,
    GrpcModule,
    MessagingModule,
    DatabaseModule,
    LivenessModule.forRoot({ path: 'health' }),
    SearchModule,
  ],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
