import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceController', () => {
  let authServiceController: AuthServiceController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [{ provide: AuthServiceService, useValue: mockAuthService }],
    }).compile();

    authServiceController = app.get<AuthServiceController>(AuthServiceController);
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const tokens = {
        accessToken: 'access.jwt',
        refreshToken: 'refresh.jwt',
      };
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await authServiceController.login({
        email: 'test@test.com',
        password: 'secret',
      });
      expect(result).toEqual(tokens);
      expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'secret');
    });

    it('should reject missing credentials', async () => {
      await expect(authServiceController.login({ email: '', password: '' })).rejects.toThrow();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('validateToken', () => {
    it('should return payload for a valid token', () => {
      mockAuthService.validateToken.mockReturnValue({ sub: 'user-1' });

      const result = authServiceController.validateToken({ token: 'valid.jwt' });
      expect(result).toEqual({ valid: true, payload: { sub: 'user-1' } });
    });
  });
});
