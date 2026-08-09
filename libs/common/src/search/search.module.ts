import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchSearchService } from './elasticsearch.service';
import { RedisSearchService } from './redis-search.service';
import { RedisDiscoveryService } from '../behaviour/redis-discovery.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ElasticsearchSearchService, RedisSearchService, RedisDiscoveryService],
  exports: [ElasticsearchSearchService, RedisSearchService, RedisDiscoveryService],
})
export class SearchModule implements OnModuleInit {
  constructor(
    private readonly redisSearch: RedisSearchService,
    private readonly redisDiscovery: RedisDiscoveryService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.redisSearch.init(
      undefined,
      this.configService.get('REDIS_HOST', 'localhost'),
      this.configService.get<number>('REDIS_PORT', 6379),
      this.configService.get('REDIS_PASSWORD', 'password'),
    );
    await this.redisDiscovery.init(
      undefined,
      this.configService.get('REDIS_HOST', 'localhost'),
      this.configService.get<number>('REDIS_PORT', 6379),
      this.configService.get('REDIS_PASSWORD', 'password'),
    );
  }
}
