import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { LivenessModule, SearchModule, ObservabilityModule } from '@app/common';
import {
  ProductServiceController,
  ProductSearchController,
  ProductGrpcController,
} from './product-service.controller';
import { ProductServiceService } from './product-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    LivenessModule,
    SearchModule,
    ObservabilityModule,
  ],
  controllers: [ProductServiceController, ProductSearchController, ProductGrpcController],
  providers: [ProductServiceService],
})
export class ProductServiceModule {}
