import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'hero', // Example package
    protoPath: join(__dirname, '../proto/hero.proto'), // You'd need to copy proto files appropriately
    url: process.env.GRPC_AUTH_URL || 'localhost:50051',
  },
};
