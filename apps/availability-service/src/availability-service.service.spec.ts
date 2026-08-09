import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AvailabilityServiceService } from './availability-service.service';
import { RedisService } from './redis.service';
import { EventBusService } from '@app/messaging/event-bus.service';

describe('AvailabilityServiceService', () => {
  let service: AvailabilityServiceService;
  let prisma: any;
  let redis: any;
  let eventBus: any;

  const warehouse = { id: 'WH_BLR_01', name: 'BLR_WH_01', status: 'active' };
  const inventory = { sku: 'P-0001-V000001', warehouseId: 'WH_BLR_01', availableQuantity: 10, reservedQuantity: 1 };
  const serviceability = [{ pincode: '560103', warehouseId: 'WH_BLR_01', priority: 1, deliveryDays: 1, active: true, warehouse }];

  beforeEach(async () => {
    prisma = {
      pincodeServiceability: { findMany: jest.fn().mockResolvedValue(serviceability) },
      warehouseInventory: {
        findUnique: jest.fn().mockResolvedValue(inventory),
        update: jest.fn().mockResolvedValue({ ...inventory, reservedQuantity: inventory.reservedQuantity + 1 }),
      },
      inventoryReservation: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'res-1', status: 'RESERVED', expiryTime: new Date(), quantity: 1 }),
        update: jest.fn().mockResolvedValue({ id: 'res-1', status: 'CONFIRMED', expiryTime: new Date() }),
      },
      warehouse: { findUnique: jest.fn().mockResolvedValue({ name: 'BLR_WH_01' }) },
      $transaction: jest.fn((ops) => Promise.all(ops)),
    };
    redis = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      invalidatePattern: jest.fn().mockResolvedValue(0),
    };
    eventBus = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityServiceService,
        { provide: 'PRISMA_CLIENT', useValue: prisma },
        { provide: RedisService, useValue: redis },
        { provide: EventBusService, useValue: eventBus },
        { provide: ConfigService, useValue: { get: (key: string, def: any) => def } },
      ],
    }).compile();

    service = module.get<AvailabilityServiceService>(AvailabilityServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns available with warehouse + delivery on a cache miss', async () => {
    const result = await service.checkAvailability('P-0001-V000001', '560103', 2);
    expect(result.available).toBe(true);
    expect(result.warehouse).toBe('BLR_WH_01');
    expect(result.delivery?.days).toBe(1);
    expect(redis.set).toHaveBeenCalled();
  });

  it('serves from cache when cached stock satisfies the quantity', async () => {
    redis.get.mockResolvedValue({
      available: true,
      warehouse: 'BLR_WH_01',
      delivery: { days: 1, expected: 'tomorrow', deliveryDate: '2026-08-10' },
      availableQty: 10,
      reservedQty: 1,
    });
    const result = await service.checkAvailability('P-0001-V000001', '560103', 2);
    expect(result.available).toBe(true);
    expect(prisma.pincodeServiceability.findMany).not.toHaveBeenCalled();
  });

  it('returns unavailable and caches when no warehouse can serve the pincode', async () => {
    prisma.pincodeServiceability.findMany.mockResolvedValue([]);
    const result = await service.checkAvailability('P-0001-V000001', '560103', 1);
    expect(result.available).toBe(false);
    expect(redis.set).toHaveBeenCalledWith(
      expect.stringContaining('availability:P-0001-V000001:560103'),
      { available: false, quantityAvailable: false },
      expect.any(Number),
    );
  });

  it('rejects an invalid pincode', async () => {
    await expect(service.checkAvailability('SKU', '123')).rejects.toThrow(BadRequestException);
  });

  it('reserves stock and increments reserved quantity', async () => {
    const result = await service.reserve('P-0001-V000001', '560103', 1);
    expect(result.reservationId).toBe('res-1');
    expect(prisma.warehouseInventory.update).toHaveBeenCalled();
    expect(redis.invalidatePattern).toHaveBeenCalledWith('availability:P-0001-V000001:*');
  });

  it('rejects reservation when stock is insufficient', async () => {
    prisma.pincodeServiceability.findMany.mockResolvedValue([
      { ...serviceability[0], deliveryDays: 1 },
    ]);
    prisma.warehouseInventory.findUnique.mockResolvedValue({ ...inventory, availableQuantity: 2 });
    await expect(service.reserve('P-0001-V000001', '560103', 5)).rejects.toThrow(ConflictException);
  });
});
