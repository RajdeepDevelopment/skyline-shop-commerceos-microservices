import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';

describe('OrderServiceController', () => {
  let orderServiceController: OrderServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderServiceController],
      providers: [OrderServiceService, { provide: 'PRISMA_CLIENT', useValue: {} }],
    }).compile();

    orderServiceController = app.get<OrderServiceController>(OrderServiceController);
  });

  it('should be defined', () => {
    expect(orderServiceController).toBeDefined();
  });
});
