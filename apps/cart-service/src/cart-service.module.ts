import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@app/database';
import { LivenessModule, ObservabilityModule } from '@app/common';
import { CartServiceController } from './cart-service.controller';
import { CartServiceService } from './cart-service.service';
import { DecimalSerializationInterceptor } from './decimal-serialization.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    LivenessModule,
    DatabaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CartServiceController],
  providers: [CartServiceService, DecimalSerializationInterceptor],
})
export class CartServiceModule {}
