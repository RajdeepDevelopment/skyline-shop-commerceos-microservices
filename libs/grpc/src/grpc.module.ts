import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { join } from 'path';

import { PROTO_PATHS } from './constants';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_AUTH_URL', 'localhost:50051'),
            package: 'auth',
            protoPath: PROTO_PATHS.AUTH,
          },
        }),
      },
      {
        name: 'ORDER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_ORDER_URL', 'localhost:50056'),
            package: 'order',
            protoPath: PROTO_PATHS.ORDER,
          },
        }),
      },
      {
        name: 'PRODUCT_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('GRPC_PRODUCT_URL', 'localhost:50053'),
            package: 'product',
            protoPath: PROTO_PATHS.PRODUCT,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
