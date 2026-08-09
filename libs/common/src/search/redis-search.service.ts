import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

const RECENT_SEARCHES_MAX = 10;
const POPULAR_SEARCHES_MAX = 100;
const RESULT_CACHE_TTL = 300;
const POPULAR_SEARCHES_TTL = 86400 * 7;

@Injectable()
export class RedisSearchService {
  private readonly logger = new Logger(RedisSearchService.name);
  private readonly prefix = 'search:';
  private client: Redis | null = null;
  private available = false;

  async init(redisUrl?: string, host?: string, port?: number, password?: string): Promise<void> {
    try {
      this.client = new Redis({
        host: host || 'localhost',
        port: port || 6379,
        password: password || 'password',
        retryStrategy: (times) => Math.min(times * 100, 3000),
        lazyConnect: false,
        connectTimeout: 5000,
      });
      await this.client.ping();
      this.available = true;
      this.logger.log('RedisSearchService connected');
    } catch (error) {
      this.logger.warn(`RedisSearchService unavailable: ${(error as Error).message}`);
      this.client = null;
      this.available = false;
    }
  }

  private get redis(): Redis | null {
    return this.available && this.client ? this.client : null;
  }

  private recentKey(userId?: string): string {
    return userId ? `${this.prefix}recent:${userId}` : `${this.prefix}recent:anonymous`;
  }

  private popularKey(): string {
    return `${this.prefix}popular`;
  }

  private resultCacheKey(params: Record<string, any>): string {
    const sorted = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `${this.prefix}results:${sorted}`;
  }

  async addRecentSearch(userId: string | undefined, query: string): Promise<void> {
    const r = this.redis;
    if (!r || !query || query.trim().length === 0) return;
    const normalized = query.trim().toLowerCase();
    const key = this.recentKey(userId);
    try {
      const pipeline = r.pipeline();
      pipeline.lrem(key, 0, normalized);
      pipeline.lpush(key, normalized);
      pipeline.ltrim(key, 0, RECENT_SEARCHES_MAX - 1);
      pipeline.expire(key, POPULAR_SEARCHES_TTL);
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to add recent search: ${(error as Error).message}`);
    }
  }

  async getRecentSearches(
    userId: string | undefined,
    limit = RECENT_SEARCHES_MAX,
  ): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(this.recentKey(userId), 0, limit - 1);
    } catch {
      return [];
    }
  }

  async removeRecentSearch(userId: string | undefined, query: string): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      await r.lrem(this.recentKey(userId), 0, query.trim().toLowerCase());
    } catch (error) {
      this.logger.warn(`Failed to remove recent search: ${(error as Error).message}`);
    }
  }

  async clearRecentSearches(userId: string): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      await r.del(this.recentKey(userId));
    } catch (error) {
      this.logger.warn(`Failed to clear recent searches: ${(error as Error).message}`);
    }
  }

  async trackPopularSearch(query: string): Promise<void> {
    const r = this.redis;
    if (!r) return;
    if (!query || query.trim().length === 0) return;
    const normalized = query.trim().toLowerCase();
    try {
      await r.zincrby(this.popularKey(), 1, normalized);
      const count = await r.zcard(this.popularKey());
      if (count > POPULAR_SEARCHES_MAX) {
        await r.zremrangebyrank(this.popularKey(), 0, count - POPULAR_SEARCHES_MAX - 1);
      }
      await r.expire(this.popularKey(), POPULAR_SEARCHES_TTL);
    } catch (error) {
      this.logger.warn(`Failed to track popular search: ${(error as Error).message}`);
    }
  }

  async getPopularSearches(limit = 10): Promise<{ query: string; count: number }[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      const results = await r.zrevrange(this.popularKey(), 0, limit - 1, 'WITHSCORES');
      const popular: { query: string; count: number }[] = [];
      for (let i = 0; i < results.length; i += 2) {
        popular.push({ query: results[i], count: parseInt(results[i + 1], 10) || 0 });
      }
      return popular;
    } catch {
      return [];
    }
  }

  async cacheSearchResults(params: Record<string, any>, results: any): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      await r.setex(this.resultCacheKey(params), RESULT_CACHE_TTL, JSON.stringify(results));
    } catch (error) {
      this.logger.warn(`Failed to cache search results: ${(error as Error).message}`);
    }
  }

  async getCachedSearchResults(params: Record<string, any>): Promise<any> {
    const r = this.redis;
    if (!r) return null;
    try {
      const cached = await r.get(this.resultCacheKey(params));
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  async invalidateSearchCache(): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      const keys = await r.keys(`${this.prefix}results:*`);
      if (keys.length > 0) await r.del(...keys);
    } catch (error) {
      this.logger.warn(`Failed to invalidate search cache: ${(error as Error).message}`);
    }
  }
}
