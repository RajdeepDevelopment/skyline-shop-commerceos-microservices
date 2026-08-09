import { Controller, Get } from '@nestjs/common';
import { RedisDiscoveryService } from '@app/common';
import { AnalyticsServiceService } from './analytics-service.service';
import { ClickHouseService } from './clickhouse.service';

@Controller()
export class AnalyticsServiceController {
  constructor(
    private readonly analyticsServiceService: AnalyticsServiceService,
    private readonly redisDiscovery: RedisDiscoveryService,
    private readonly clickhouse: ClickHouseService,
  ) {}

  @Get()
  getHello(): string {
    return this.analyticsServiceService.getHello();
  }

  @Get('analytics/stats')
  async stats() {
    const [trending, bestSellers, deals, topViewed] = await Promise.all([
      this.redisDiscovery.getRankedList('trending', 'global', 10),
      this.redisDiscovery.getRankedList('bestsellers', 'global', 10),
      this.redisDiscovery.getRankedList('deals', 'global', 10),
      this.redisDiscovery.getTopProducts(10),
    ]);
    return {
      clickhouse: this.clickhouse.isAvailable,
      trending,
      bestSellers,
      deals,
      topViewed,
    };
  }
}
