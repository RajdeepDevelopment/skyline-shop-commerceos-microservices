import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EventBusService } from '@app/messaging/event-bus.service';

jest.mock('@app/common', () => ({
  LoginDto: class {},
  RegisterDto: class {},
  CreateProductDto: class {},
  UpdateProductDto: class {},
  CreateOrderDto: class {},
  ProductResponseDto: class {},
  OrderResponseDto: class {},
  JwtAuthGuard: class {},
  RolesGuard: class {},
  Roles: () => () => {},
  Public: () => () => {},
  Role: { ADMIN: 'ADMIN', MANAGER: 'MANAGER' },
  retryWithBackoff: () => {},
  RedisSearchService: class {},
  RedisDiscoveryService: class {},
  EncryptionService: class {},
  BehaviourEventType: {
    PRODUCT_VIEW: 'PRODUCT_VIEW',
    SEARCH: 'SEARCH',
    SEARCH_CLICK: 'SEARCH_CLICK',
    PRODUCT_CLICK: 'PRODUCT_CLICK',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    WISHLIST_ADD: 'WISHLIST_ADD',
    PURCHASE: 'PURCHASE',
    PRODUCT_SHARE: 'PRODUCT_SHARE',
    REVIEW_CREATED: 'REVIEW_CREATED',
    RETURN_PRODUCT: 'RETURN_PRODUCT',
    IMPRESSION: 'IMPRESSION',
  },
  BehaviourEvents: { EVENT: 'behaviour.event' },
}));

import { ApiGatewayController } from './api-gateway.controller';
import {
  BehaviourEventType,
  BehaviourEvents,
  RedisSearchService,
  RedisDiscoveryService,
} from '@app/common';

describe('ApiGatewayController (discovery)', () => {
  let controller: ApiGatewayController;

  const httpServiceMock = {
    get: jest.fn(() => of({ data: [{ id: 'p1' }, { id: 'p2' }] })),
    request: jest.fn(() => of({ data: {} })),
    post: jest.fn(() => of({ data: {} })),
  };

  const redisDiscoveryMock = {
    trackEvent: jest.fn().mockResolvedValue(undefined),
    getRankedList: jest.fn().mockResolvedValue(['p1', 'p2']),
    getRecentViewed: jest.fn().mockResolvedValue(['p1']),
    getProductsMeta: jest.fn().mockResolvedValue({}),
    setBoost: jest.fn().mockResolvedValue(undefined),
    clearBoost: jest.fn().mockResolvedValue(undefined),
    setFrequentlyBought: jest.fn().mockResolvedValue(undefined),
  };

  const eventBusMock = {
    publish: jest.fn().mockResolvedValue(undefined),
  };

  const grpcStub = { getService: jest.fn(() => ({ some: jest.fn() })) };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayController],
      providers: [
        { provide: 'AUTH_PACKAGE', useValue: grpcStub },
        { provide: 'ORDER_PACKAGE', useValue: grpcStub },
        { provide: 'PRODUCT_PACKAGE', useValue: grpcStub },
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: { get: (k: string, d?: unknown) => d } },
        { provide: RedisSearchService, useValue: {} },
        { provide: RedisDiscoveryService, useValue: redisDiscoveryMock },
        { provide: EventBusService, useValue: eventBusMock },
      ],
    }).compile();

    controller = module.get(ApiGatewayController);
  });

  describe('POST /events', () => {
    it('tracks a valid event to Redis and publishes to NATS', async () => {
      const req = {
        user: { sub: 'u1' },
        headers: { 'x-session-id': 's1' },
        url: '/api/v1/events',
      };
      const body = {
        eventType: BehaviourEventType.PRODUCT_VIEW,
        productId: 'p1',
        category: 'electronics',
      };
      const result = await controller.trackEvent(body, req);

      expect(result).toEqual({ ok: true });
      expect(redisDiscoveryMock.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'PRODUCT_VIEW',
          userId: 'u1',
          productId: 'p1',
        }),
        'user:u1',
      );
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        BehaviourEvents.EVENT,
        expect.objectContaining({ eventType: 'PRODUCT_VIEW' }),
      );
    });

    it('rejects unknown event types', async () => {
      const result = await controller.trackEvent({ eventType: 'NOT_A_TYPE' }, { headers: {} });
      expect(result.ok).toBe(false);
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });
  });

  describe('discovery endpoints', () => {
    it('GET /discovery/trending hydrates ranked ids into products', async () => {
      const products = await controller.discoveryTrending(undefined, '20');
      expect(redisDiscoveryMock.getRankedList).toHaveBeenCalledWith('trending', 'global', 20);
      expect(products).toEqual([{ id: 'p1' }, { id: 'p2' }]);
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/by-ids'),
        expect.objectContaining({ params: { ids: 'p1,p2' } }),
      );
    });

    it('GET /discovery/best-sellers supports category scoping', async () => {
      await controller.discoveryBestSellers('electronics', '5');
      expect(redisDiscoveryMock.getRankedList).toHaveBeenCalledWith(
        'bestsellers',
        'electronics',
        5,
      );
    });

    it('GET /discovery/deals returns ranked deals', async () => {
      await controller.discoveryDeals('10');
      expect(redisDiscoveryMock.getRankedList).toHaveBeenCalledWith('deals', 'global', 10);
    });

    it('GET /discovery/home aggregates all sections', async () => {
      const home = await controller.discoveryHome({ headers: {} });
      expect(Object.keys(home).sort()).toEqual([
        'bestSellers',
        'deals',
        'recentlyViewed',
        'recommendations',
        'trending',
      ]);
    });
  });

  describe('admin boost controls', () => {
    it('sets a clamped boost score', async () => {
      const result = await controller.boostProduct({ productId: 'p1', score: 150 });
      expect(redisDiscoveryMock.setBoost).toHaveBeenCalledWith('p1', 100, 7);
      expect(result.score).toBe(100);
    });

    it('removes a boost', async () => {
      await controller.removeBoost('p1');
      expect(redisDiscoveryMock.clearBoost).toHaveBeenCalledWith('p1');
    });
  });
});
