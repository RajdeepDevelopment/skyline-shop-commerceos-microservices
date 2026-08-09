import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@app/database', () => ({ DatabaseService: class {} }));
jest.mock('@app/common', () => ({
  ElasticsearchSearchService: class {},
  RedisDiscoveryService: class {},
  SearchProduct: class {},
}));

import { ProductSearchController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import { ElasticsearchSearchService } from '@app/common';
import { RedisDiscoveryService } from '@app/common';

describe('ProductSearchController', () => {
  let controller: ProductSearchController;

  const productServiceMock = {
    findByIds: jest.fn(),
    findSimilar: jest.fn(),
    findOne: jest.fn(),
  };

  const redisMock = {
    getFrequentlyBought: jest.fn().mockResolvedValue([]),
  };

  const esMock = {
    suggest: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSearchController],
      providers: [
        { provide: ProductServiceService, useValue: productServiceMock },
        { provide: ElasticsearchSearchService, useValue: esMock },
        { provide: RedisDiscoveryService, useValue: redisMock },
      ],
    }).compile();

    controller = module.get(ProductSearchController);
  });

  describe('GET products/by-ids', () => {
    it('splits comma-separated ids and delegates to the service', async () => {
      productServiceMock.findByIds.mockResolvedValue([{ id: 'p1' }]);
      const result = await controller.findByIds('p1, p2,');
      expect(productServiceMock.findByIds).toHaveBeenCalledWith(['p1', 'p2']);
      expect(result).toEqual([{ id: 'p1' }]);
    });

    it('returns an empty list for missing ids', async () => {
      productServiceMock.findByIds.mockResolvedValue([]);
      const result = await controller.findByIds(undefined);
      expect(productServiceMock.findByIds).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });
  });

  describe('GET products/:id/frequently-bought', () => {
    it('serves cached co-purchase ids from Redis', async () => {
      redisMock.getFrequentlyBought.mockResolvedValue(['p2', 'p3']);
      productServiceMock.findByIds.mockResolvedValue([{ id: 'p2' }, { id: 'p3' }]);
      const result = await controller.frequentlyBought('p1');
      expect(redisMock.getFrequentlyBought).toHaveBeenCalledWith('p1', 4);
      expect(productServiceMock.findByIds).toHaveBeenCalledWith(['p2', 'p3']);
      expect(result).toHaveLength(2);
    });

    it('falls back to category-similar products when cache is empty', async () => {
      redisMock.getFrequentlyBought.mockResolvedValue([]);
      productServiceMock.findSimilar.mockResolvedValue([
        { id: 'p1' },
        { id: 'p2' },
        { id: 'p3' },
        { id: 'p4' },
      ]);
      const result = await controller.frequentlyBought('p1');
      expect(productServiceMock.findSimilar).toHaveBeenCalledWith('p1', 4);
      expect(result.map((p: any) => p.id)).not.toContain('p1');
    });
  });

  describe('GET products/:id/similar', () => {
    it('delegates to findSimilar with the requested limit', async () => {
      productServiceMock.findSimilar.mockResolvedValue([{ id: 'p2' }]);
      const result = await controller.similar('p1', '6');
      expect(productServiceMock.findSimilar).toHaveBeenCalledWith('p1', 6);
      expect(result).toEqual([{ id: 'p2' }]);
    });
  });

  describe('GET products/:id', () => {
    it('returns a normalized product payload', async () => {
      productServiceMock.findOne.mockResolvedValue({
        id: 'p1',
        sku: 'SKU1',
        title: 'Widget',
        price: 100,
        rating: 4.5,
        discountPercentage: 10,
        stock: 5,
        inStock: true,
        category: 'electronics',
        images: ['a.jpg'],
        createdAt: new Date('2026-01-01T00:00:00Z'),
      });
      const result = await controller.findOne('p1');
      expect(result).toMatchObject({
        id: 'p1',
        price: 100,
        inStock: true,
        category: 'electronics',
      });
    });
  });
});
