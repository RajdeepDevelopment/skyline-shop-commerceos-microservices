import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { CartServiceController } from './cart-service.controller';
import { CartServiceService } from './cart-service.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [CartServiceController],
  providers: [CartServiceService],
})
export class CartServiceModule {}
