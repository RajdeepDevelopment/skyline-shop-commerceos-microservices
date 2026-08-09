import { Test, TestingModule } from '@nestjs/testing';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';
import { EventBusService } from '@app/messaging/event-bus.service';

describe('InventoryServiceController', () => {
  let inventoryServiceController: InventoryServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InventoryServiceController],
      providers: [
        InventoryServiceService,
        { provide: 'PRISMA_CLIENT', useValue: {} },
        { provide: EventBusService, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    inventoryServiceController = app.get<InventoryServiceController>(InventoryServiceController);
  });

  it('should be defined', () => {
    expect(inventoryServiceController).toBeDefined();
  });
});
