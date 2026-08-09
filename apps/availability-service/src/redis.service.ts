import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const DEFAULT_TTL_SECONDS = 10 * 60;

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private available = false;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  private connect(): void {
    try {
      this.client = new Redis({
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD', 'password'),
        retryStrategy: (times) => Math.min(times * 100, 3000),
        connectTimeout: 5000,
        maxRetriesPerRequest: 1,
      });
      this.client.on('error', (error) => {
        this.logger.warn(`Redis error: ${error.message}`);
      });
      this.client.on('ready', () => {
        this.available = true;
        this.logger.log('Redis connected');
      });
      this.client.on('close', () => {
        this.available = false;
      });
    } catch (error) {
      this.logger.warn(`Redis unavailable: ${(error as Error).message}`);
      this.client = null;
    }
  }

  private get redis(): Redis | null {
    return this.available && this.client ? this.client : null;
  }

  async get<T = any>(key: string): Promise<T | null> {
    const client = this.redis;
    if (!client) return null;
    try {
      const raw = await client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      this.logger.warn(`Redis GET ${key} failed: ${(error as Error).message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<void> {
    const client = this.redis;
    if (!client) return;
    try {
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis SET ${key} failed: ${(error as Error).message}`);
    }
  }

  async delete(key: string): Promise<void> {
    const client = this.redis;
    if (!client) return;
    try {
      await client.del(key);
    } catch (error) {
      this.logger.warn(`Redis DEL ${key} failed: ${(error as Error).message}`);
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    const client = this.redis;
    if (!client) return 0;
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) await client.del(...keys);
      return keys.length;
    } catch (error) {
      this.logger.warn(`Redis invalidation ${pattern} failed: ${(error as Error).message}`);
      return 0;
    }
  }
}
