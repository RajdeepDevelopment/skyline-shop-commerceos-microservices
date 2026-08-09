import { Test, TestingModule } from '@nestjs/testing';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';
import { EventBusService } from '@app/messaging/event-bus.service';

describe('PaymentServiceController', () => {
  let paymentServiceController: PaymentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentServiceController],
      providers: [
        PaymentServiceService,
        { provide: 'PRISMA_CLIENT', useValue: {} },
        { provide: EventBusService, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    paymentServiceController = app.get<PaymentServiceController>(PaymentServiceController);
  });

  it('should be defined', () => {
    expect(paymentServiceController).toBeDefined();
  });
});
