import { NestFactory } from '@nestjs/core';
import { CartServiceModule } from './cart-service.module';
import { DecimalSerializationInterceptor } from './decimal-serialization.interceptor';

async function bootstrap() {
  // Cart tables live in the products database (shared via CART_DATABASE_*_URL)
  process.env.SERVICE_NAME = 'cart';

  const app = await NestFactory.create(CartServiceModule);

  app.useGlobalInterceptors(new DecimalSerializationInterceptor());

  // Enable CORS for the frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.CART_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(`🛒 Cart Service running on port ${port}`);
}
void bootstrap();
