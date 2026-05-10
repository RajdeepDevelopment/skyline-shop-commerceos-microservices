import { NestFactory } from '@nestjs/core';
import { CartServiceModule } from './cart-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CartServiceModule);

  // Explicitly set service name for database routing
  process.env.SERVICE_NAME = 'product';

  // Enable CORS for the frontend
  app.enableCors({
    origin: true, // In production, replace with specific origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.CART_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(`🛒 Cart Service running on port ${port}`);
}
void bootstrap();
