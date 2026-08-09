import { RedisDiscoveryService } from './redis-discovery.service';
import { BehaviourEvent, BehaviourEventType } from '../events';

jest.mock('ioredis', () => {
  const mockPipeline: any = {
    zincrby: jest.fn().mockReturnThis(),
    zremrangebyrank: jest.fn().mockReturnThis(),
    expire: jest.fn().mockReturnThis(),
    lrem: jest.fn().mockReturnThis(),
    lpush: jest.fn().mockReturnThis(),
    ltrim: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    rpush: jest.fn().mockReturnThis(),
    hset: jest.fn().mockReturnThis(),
    hdel: jest.fn().mockReturnThis(),
    zrange: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };
  const mockClient: any = {
    ping: jest.fn().mockResolvedValue('PONG'),
    pipeline: jest.fn(() => mockPipeline),
    expire: jest.fn().mockResolvedValue(1),
    zincrby: jest.fn().mockResolvedValue('1'),
    zrevrange: jest.fn().mockResolvedValue([]),
    lrange: jest.fn().mockResolvedValue([]),
    hgetall: jest.fn().mockResolvedValue({}),
    zscore: jest.fn().mockResolvedValue(null),
    zcard: jest.fn().mockResolvedValue(0),
    zremrangebyrank: jest.fn().mockResolvedValue(0),
    lrem: jest.fn().mockResolvedValue(0),
    lpush: jest.fn().mockResolvedValue(1),
    ltrim: jest.fn().mockResolvedValue(1),
    del: jest.fn().mockResolvedValue(1),
    rpush: jest.fn().mockResolvedValue(1),
    hset: jest.fn().mockResolvedValue(1),
    hdel: jest.fn().mockResolvedValue(1),
    hmget: jest.fn().mockResolvedValue([]),
  };
  const MockRedis = jest.fn(() => mockClient);
  (MockRedis as any).__mockClient = mockClient;
  (MockRedis as any).__mockPipeline = mockPipeline;
  return MockRedis;
});

import Redis from 'ioredis';

const mockClient = (Redis as any).__mockClient as any;
const mockPipeline = (Redis as any).__mockPipeline as any;

describe('RedisDiscoveryService', () => {
  let service: RedisDiscoveryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    service = new RedisDiscoveryService();
    await service.init();
  });

  afterAll(() => {
    mockClient.ping.mockResolvedValue('PONG');
    mockPipeline.exec.mockResolvedValue([]);
    mockClient.lrange.mockResolvedValue([]);
    mockClient.hgetall.mockResolvedValue({});
  });

  describe('trackEvent', () => {
    it('increments daily event counters and the global views zset for product events', async () => {
      const event: BehaviourEvent = {
        eventType: BehaviourEventType.PRODUCT_VIEW,
        productId: 'p1',
        quantity: 1,
        timestamp: '2026-08-09T10:00:00.000Z',
      };
      await service.trackEvent(event);

      expect(mockClient.pipeline).toHaveBeenCalled();
      expect(mockPipeline.zincrby).toHaveBeenCalledWith(
        `discovery:events:PRODUCT_VIEW:${RedisDiscoveryService.dateKey(new Date('2026-08-09T10:00:00.000Z'))}`,
        1,
        'p1',
      );
      expect(mockPipeline.zincrby).toHaveBeenCalledWith('discovery:product-views', 1, 'p1');
      expect(mockPipeline.expire).toHaveBeenCalledWith(
        'discovery:product-views',
        expect.any(Number),
      );
      expect(mockClient.expire).toHaveBeenCalledWith(
        `discovery:events:PRODUCT_VIEW:${RedisDiscoveryService.dateKey(new Date('2026-08-09T10:00:00.000Z'))}`,
        expect.any(Number),
      );
      expect(mockPipeline.exec).toHaveBeenCalled();
    });

    it('pushes recently-viewed list for authenticated actor on PRODUCT_VIEW', async () => {
      const event: BehaviourEvent = {
        eventType: BehaviourEventType.PRODUCT_VIEW,
        productId: 'p9',
      };
      await service.trackEvent(event, 'user:abc');

      expect(mockPipeline.lrem).toHaveBeenCalledWith(
        'discovery:user:user:abc:recent-viewed',
        0,
        'p9',
      );
      expect(mockPipeline.lpush).toHaveBeenCalledWith(
        'discovery:user:user:abc:recent-viewed',
        'p9',
      );
      expect(mockPipeline.ltrim).toHaveBeenCalledWith(
        'discovery:user:user:abc:recent-viewed',
        0,
        19,
      );
    });

    it('records per-user signal lists per event type', async () => {
      const event: BehaviourEvent = {
        eventType: BehaviourEventType.ADD_TO_CART,
        productId: 'p4',
        quantity: 2,
      };
      await service.trackEvent(event, 'user:abc');

      expect(mockPipeline.zincrby).toHaveBeenCalledWith(
        `discovery:events:ADD_TO_CART:${RedisDiscoveryService.dateKey()}`,
        2,
        'p4',
      );
      expect(mockPipeline.lpush).toHaveBeenCalledWith('discovery:user:user:abc:ADD_TO_CART', 'p4');
    });
  });

  describe('ranked lists', () => {
    it('stores and reads a ranked list', async () => {
      mockClient.lrange.mockResolvedValue(['p1', 'p2', 'p3']);
      await service.setRankedList('trending', 'global', ['p1', 'p2', 'p3']);
      const result = await service.getRankedList('trending', 'global', 10);
      expect(result).toEqual(['p1', 'p2', 'p3']);
      expect(mockClient.lrange).toHaveBeenCalledWith('discovery:trending:global', 0, 9);
    });

    it('reads per-category ranked lists', async () => {
      mockClient.lrange.mockResolvedValue(['x']);
      await service.getRankedList('bestsellers', 'electronics', 5);
      expect(mockClient.lrange).toHaveBeenCalledWith('discovery:bestsellers:electronics', 0, 4);
    });
  });

  describe('aggregated counts', () => {
    it('merges daily sorted sets into per-product totals', async () => {
      const today = RedisDiscoveryService.dateKey();
      mockPipeline.exec.mockResolvedValue([
        [null, ['p1', '5', 'p2', '3']],
        [null, ['p1', '2']],
      ]);
      const counts = await service.getAggregatedCounts(BehaviourEventType.PRODUCT_VIEW, 2);
      expect(counts).toEqual({ p1: 7, p2: 3 });
      expect(mockPipeline.zrange).toHaveBeenCalledWith(
        `discovery:events:PRODUCT_VIEW:${today}`,
        0,
        -1,
        'WITHSCORES',
      );
    });
  });

  describe('admin boosts', () => {
    it('sets, reads and clears boosts', async () => {
      mockClient.hgetall.mockResolvedValue({ p1: '75', p2: '20' });
      await service.setBoost('p1', 75, 7);
      await service.setBoost('p2', 20);

      const boosts = await service.getBoosts();
      expect(boosts).toEqual({ p1: 75, p2: 20 });

      await service.clearBoost('p1');
      expect(mockClient.hdel).toHaveBeenCalledWith('discovery:boosts', 'p1');
    });
  });

  describe('frequently bought together', () => {
    it('stores and reads FBT list with TTL', async () => {
      mockClient.lrange.mockResolvedValue(['p2', 'p3']);
      await service.setFrequentlyBought('p1', ['p2', 'p3']);
      const result = await service.getFrequentlyBought('p1', 4);
      expect(result).toEqual(['p2', 'p3']);
      expect(mockClient.lrange).toHaveBeenCalledWith('discovery:fbt:p1', 0, 3);
    });
  });

  describe('dateKey', () => {
    it('formats UTC dates as YYYY-MM-DD', () => {
      expect(RedisDiscoveryService.dateKey(new Date('2026-08-09T00:00:00Z'))).toBe('2026-08-09');
    });
  });
});
