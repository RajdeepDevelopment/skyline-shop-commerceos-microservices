import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CartServiceController } from './cart-service.controller';
import { CartServiceService } from './cart-service.service';
import { DatabaseService } from '@app/database';

describe('CartServiceController', () => {
  let controller: CartServiceController;

  const mockCartService = {
    getCart: jest.fn(),
    addItem: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CartServiceController],
      providers: [
        { provide: CartServiceService, useValue: mockCartService },
        { provide: DatabaseService, useValue: {} },
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
      ],
    }).compile();

    controller = app.get<CartServiceController>(CartServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return the cart for a user', async () => {
      const cart = { id: 'cart-1', userId: 'user-1', items: [] };
      mockCartService.getCart.mockResolvedValue(cart);

      const result = await controller.getCart('user-1');
      expect(result).toEqual(cart);
      expect(mockCartService.getCart).toHaveBeenCalledWith('user-1');
    });
  });
});
