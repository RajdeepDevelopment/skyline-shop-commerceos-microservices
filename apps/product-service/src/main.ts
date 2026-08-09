import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@app/grpc';
import { ProductServiceModule } from './product-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'product';
  const app = await NestFactory.create(ProductServiceModule);

  // gRPC microservice transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.GRPC_PRODUCT_URL?.split(':')[1] ?? '50053'}`,
      package: 'product',
      protoPath: PROTO_PATHS.PRODUCT,
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PRODUCT_SERVICE_PORT || 3003;
  await app.listen(port);
  console.log(`✅ Product Service running on port ${port}`);
}
void bootstrap();
