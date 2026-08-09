import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalHttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { CorrelationIdMiddleware } from '@app/common/middleware/correlation-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    bufferLogs: true,
  });

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Correlation ID middleware (for request tracing)
  app.use(new CorrelationIdMiddleware().use.bind(new CorrelationIdMiddleware()));

  // API versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Swagger Protection
  const apiUser = process.env.API_USER || 'admin';
  const apiPassword = process.env.API_PASSWORD || 'admin';

  app.use(
    [
      '/api/v1/docs',
      '/api/v1/docs-json',
      '/api/v1/docs-auth',
      '/api/v1/docs-commerce',
      '/api/v1/docs-system',
    ],

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('express-basic-auth')({
      challenge: true,
      users: { [apiUser]: apiPassword },
    }),
  );

  const baseConfig = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();

  // 1. AUTH API Document
  const authConfig = new DocumentBuilder()
    .setTitle('E-Commerce Auth API')
    .setDescription('User Identity & Access Management')
    .addTag('Auth')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const authDoc = SwaggerModule.createDocument(app, authConfig, {
    include: [ApiGatewayModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/v1/docs/auth', app, authDoc, {
    customSiteTitle: 'Auth API Docs',
  });

  // 2. COMMERCE API Document (Products & Orders)
  const commerceConfig = new DocumentBuilder()
    .setTitle('E-Commerce Store API')
    .setDescription('Product Catalog & Order Processing')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Cart')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const commerceDoc = SwaggerModule.createDocument(app, commerceConfig);
  SwaggerModule.setup('api/v1/docs/commerce', app, commerceDoc, {
    customSiteTitle: 'Commerce API Docs',
  });

  // 3. SYSTEM/INFRA API Document (Health, Metrics, etc.)
  const systemConfig = new DocumentBuilder()
    .setTitle('E-Commerce System API')
    .setDescription('Health Checks, Metrics & Background Jobs')
    .addTag('System')
    .addTag('Inventory')
    .addTag('Payment')
    .build();
  const systemDoc = SwaggerModule.createDocument(app, systemConfig);
  SwaggerModule.setup('api/v1/docs/system', app, systemDoc, {
    customSiteTitle: 'System API Docs',
  });

  // Default redirect for root docs
  const config = new DocumentBuilder()
    .setTitle('Master API Gateway')
    .setDescription('Unified entrance to all microservices')
    .addTag('Auth')
    .addTag('Products')
    .addTag('Orders')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = parseInt(process.env.API_GATEWAY_PORT ?? '3000', 10);

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);

  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║              SKYLINE COMMERCEOS - ALL SERVICES              ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  SERVICES                                                   ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log(`║  API Gateway:      http://localhost:${port}                   ║`);
  console.log('║  Auth Service:     http://localhost:3001                     ║');
  console.log('║  Product Service:  http://localhost:3003                     ║');
  console.log('║  Cart Service:     http://localhost:3002                     ║');
  console.log('║  Order Service:    http://localhost:3006                     ║');
  console.log('║  Payment Service:  http://localhost:3007                     ║');
  console.log('║  Inventory:        http://localhost:3004                     ║');
  console.log('║                                                               ║');
  console.log('║  API DOCS                                                    ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log('║  Swagger Master:   http://localhost:3000/api/v1/docs         ║');
  console.log('║  Swagger Auth:     http://localhost:3000/api/v1/docs/auth    ║');
  console.log('║  Swagger Commerce: http://localhost:3000/api/v1/docs/commerce║');
  console.log('║  Swagger System:   http://localhost:3000/api/v1/docs/system  ║');
  console.log('║                                                               ║');
  console.log('║  DATABASES                                                    ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log('║  Auth DB:          http://localhost:5050  (pgAdmin)          ║');
  console.log('║  Order DB:         http://localhost:5050  (pgAdmin)          ║');
  console.log('║  Product DB:       http://localhost:5050  (pgAdmin)          ║');
  console.log('║  PgBouncer:        localhost:6432                            ║');
  console.log('║                                                               ║');
  console.log('║  OBSERVABILITY                                                ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log('║  Grafana:          http://localhost:3100  (admin/admin)      ║');
  console.log('║  Prometheus:       http://localhost:9090                     ║');
  console.log('║  Jaeger Traces:    http://localhost:16686                    ║');
  console.log('║  AlertManager:     http://localhost:9093                     ║');
  console.log('║                                                               ║');
  console.log('║  DATA TOOLS                                                   ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log('║  pgAdmin:          http://localhost:5050                     ║');
  console.log('║  Redis Insight:    http://localhost:5540                     ║');
  console.log('║  OpenSearch UI:    http://localhost:5601                     ║');
  console.log('║  NATS UI (Nui):    http://localhost:31311                    ║');
  console.log('║                                                               ║');
  console.log('║  FRONTEND                                                     ║');
  console.log('║  ─────────────────────────────────────────────────────────── ║');
  console.log('║  Web Shop:         http://localhost:5173                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\n');
}

void bootstrap();
