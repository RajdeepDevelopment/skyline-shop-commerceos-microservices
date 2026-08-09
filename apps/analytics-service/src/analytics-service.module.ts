import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { LivenessModule, SearchModule, ObservabilityModule } from '@app/common';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { BehaviourEventsController } from './behaviour.controller';
import { ClickHouseService } from './clickhouse.service';
import { RankingEngineService } from './ranking-engine.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    LivenessModule,
    SearchModule,
    ObservabilityModule,
  ],
  controllers: [AnalyticsServiceController, BehaviourEventsController],
  providers: [AnalyticsServiceService, ClickHouseService, RankingEngineService],
})
export class AnalyticsServiceModule {}
