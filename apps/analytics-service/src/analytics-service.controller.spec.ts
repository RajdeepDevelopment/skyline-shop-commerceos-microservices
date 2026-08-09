import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { RedisDiscoveryService } from '@app/common';
import { ClickHouseService } from './clickhouse.service';

describe('AnalyticsServiceController', () => {
  let analyticsServiceController: AnalyticsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsServiceController],
      providers: [
        AnalyticsServiceService,
        { provide: RedisDiscoveryService, useValue: {} },
        { provide: ClickHouseService, useValue: { insert: jest.fn(), query: jest.fn() } },
      ],
    }).compile();

    analyticsServiceController = app.get<AnalyticsServiceController>(AnalyticsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(analyticsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
