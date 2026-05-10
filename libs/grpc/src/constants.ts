import { join } from 'path';

export const PROTO_PATHS = {
  AUTH: join(process.cwd(), 'proto/auth.proto'),
  ORDER: join(process.cwd(), 'proto/order.proto'),
  PRODUCT: join(process.cwd(), 'proto/product.proto'),
  // Add more as they are created
};
