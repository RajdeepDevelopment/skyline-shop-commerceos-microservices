import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

export default async () => {
  console.log('Starting Testcontainers...');

  const postgres = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('ecommerce_test')
    .withUsername('root')
    .withPassword('password')
    .start();

  const redis = await new RedisContainer('redis:7-alpine').start();

  process.env.DATABASE_URL = postgres.getConnectionUri();
  process.env.REDIS_HOST = redis.getHost();
  process.env.REDIS_PORT = redis.getPort().toString();

  global.__POSTGRES_CONTAINER__ = postgres;
  global.__REDIS_CONTAINER__ = redis;

  console.log('Testcontainers started successfully.');
};
