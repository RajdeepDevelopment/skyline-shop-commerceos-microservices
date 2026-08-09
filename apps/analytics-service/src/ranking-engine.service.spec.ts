import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

jest.mock('@app/database', () => ({ DatabaseService: class {} }));
jest.mock('@app/common', () => ({
  RedisDiscoveryService: class {},
  BehaviourEventType: {
    PRODUCT_VIEW: 'PRODUCT_VIEW',
    SEARCH_CLICK: 'SEARCH_CLICK',
    ADD_TO_CART: 'ADD_TO_CART',
    WISHLIST_ADD: 'WISHLIST_ADD',
    PURCHASE: 'PURCHASE',
    RETURN_PRODUCT: 'RETURN_PRODUCT',
  },
}));

import { DatabaseService } from '@app/database';
import { RedisDiscoveryService, BehaviourEventType } from '@app/common';
import { ClickHouseService } from './clickhouse.service';
import { RankingEngineService } from './ranking-engine.service';

const product = {
  id: 'p1',
  category: 'electronics',
  price: 100,
  rating: 4.5,
  stock: 10,
  createdAt: new Date(),
  discountPercentage: 20,
};

const shard = {
  product: { findMany: jest.fn().mockResolvedValue([product]) },
};

const databaseMock = {
  getAllShards: jest.fn().mockReturnValue([shard]),
};

const redisDiscoveryMock = {
  getAggregatedCounts: jest.fn().mockResolvedValue({}),
  getBoosts: jest.fn().mockResolvedValue({}),
  setProductsMeta: jest.fn().mockResolvedValue(undefined),
  setRankedList: jest.fn().mockResolvedValue(undefined),
  setFrequentlyBought: jest.fn().mockResolvedValue(undefined),
  getFrequentlyBought: jest.fn().mockResolvedValue([]),
};

const clickhouseMock = {
  query: jest.fn().mockResolvedValue([]),
};

describe('RankingEngineService', () => {
  let service: RankingEngineService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingEngineService,
        { provide: DatabaseService, useValue: databaseMock },
        { provide: RedisDiscoveryService, useValue: redisDiscoveryMock },
        { provide: ClickHouseService, useValue: clickhouseMock },
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    service = module.get(RankingEngineService);
  });

  describe('run', () => {
    it('publishes global and per-category ranked lists and product metadata', async () => {
      await service.run();

      expect(databaseMock.getAllShards).toHaveBeenCalled();
      expect(redisDiscoveryMock.getAggregatedCounts).toHaveBeenCalledWith(
        BehaviourEventType.PRODUCT_VIEW,
        7,
      );

      const setRanked = redisDiscoveryMock.setRankedList.mock.calls;
      const kinds = setRanked.map((c: any) => `${c[0]}:${c[1]}`);
      expect(kinds).toContain('trending:global');
      expect(kinds).toContain('bestsellers:global');
      expect(kinds).toContain('deals:global');
      expect(kinds).toContain('trending:electronics');
      expect(kinds).toContain('bestsellers:electronics');

      expect(redisDiscoveryMock.setProductsMeta).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'p1', category: 'electronics' }),
      ]);
    });

    it('filters deals to discounted products in stock', async () => {
      await service.run();
      const dealsCall = redisDiscoveryMock.setRankedList.mock.calls.find(
        (c: any) => c[0] === 'deals' && c[1] === 'global',
      );
      expect(dealsCall).toBeDefined();
      expect(dealsCall[2]).toContain('p1');
    });

    it('computes frequently-bought pairs from ClickHouse purchase sessions', async () => {
      clickhouseMock.query.mockResolvedValue([
        { session_id: 's1', products: ['p1', 'p2', 'p3'] },
        { session_id: 's2', products: ['p1', 'p2'] },
      ]);
      await service.run();

      expect(redisDiscoveryMock.setFrequentlyBought).toHaveBeenCalled();
      const fbtCalls = redisDiscoveryMock.setFrequentlyBought.mock.calls;
      expect(fbtCalls).toHaveLength(3);
      const forP1 = fbtCalls.find((c: any) => c[0] === 'p1');
      expect(forP1).toBeDefined();
      expect(forP1[1]).toContain('p2');
    });

    it('handles empty product sets gracefully', async () => {
      shard.product.findMany.mockResolvedValueOnce([]);
      await service.run();
      expect(redisDiscoveryMock.setRankedList).not.toHaveBeenCalled();
    });
  });
});
