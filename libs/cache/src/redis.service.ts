import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD', 'password'),
      retryStrategy: (times: number) => Math.min(times * 100, 3000), // Retry mechanism
      lazyConnect: true,
    });

    this.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err.message);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    console.log('[Redis] Connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    await this.quit();
    console.log('[Redis] Connection closed (graceful shutdown)');
  }

  /**
   * Get a cached value; return null if not found.
   */
  async getCache<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /**
   * Set a cached value with an optional TTL in seconds.
   */
  async setCache<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    await this.setex(key, ttlSeconds, JSON.stringify(value));
  }

  /**
   * Delete a cached value (cache invalidation).
   */
  async deleteCache(key: string): Promise<void> {
    await this.del(key);
  }

  /**
   * Delete all keys matching a pattern (e.g., 'user:*')
   */
  async deleteCachePattern(pattern: string): Promise<void> {
    const keys = await this.keys(pattern);
    if (keys.length > 0) {
      await this.del(...keys);
    }
  }
}
