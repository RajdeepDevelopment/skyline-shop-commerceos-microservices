import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        // Database
        DATABASE_URL: Joi.string().required(),
        // Redis
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().default('password'),
        // NATS
        NATS_URL: Joi.string().default('nats://localhost:4222'),
        // JWT
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        // Ports
        API_GATEWAY_PORT: Joi.number().default(3000),
        AUTH_SERVICE_PORT: Joi.number().default(3001),
        // AWS (optional — used by @app/aws; unset creds fall back to Floci defaults)
        AWS_ENDPOINT_URL: Joi.string().allow('').optional(),
        AWS_ACCESS_KEY_ID: Joi.string().allow('').optional(),
        AWS_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
        AWS_DEFAULT_REGION: Joi.string().allow('').optional(),
        AWS_STORAGE_MODE: Joi.string().valid('floci', 'local', 'aws').optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  exports: [NestConfigModule],
})
export class AppConfigModule {}
