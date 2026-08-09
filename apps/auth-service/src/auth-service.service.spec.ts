import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@app/database';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-1', email: 'test@test.com', roles: ['user'] }),
  };

  const mockDatabase = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: DatabaseService, useValue: mockDatabase },
      ],
    }).compile();

    service = module.get<AuthServiceService>(AuthServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should return an accessToken and a refreshToken', () => {
      const payload = { sub: 'user-1', email: 'test@test.com', roles: ['user'] };
      const result = service.generateTokens(payload);

      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.refreshToken).toBeDefined();
      expect(result.refreshToken.length).toBeGreaterThan(0);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('validateToken', () => {
    it('should return the payload for a valid token', () => {
      const result = service.validateToken('valid.jwt.token');
      expect(result).not.toBeNull();
      expect(result?.sub).toBe('user-1');
    });

    it('should return null for an invalid token', () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      const result = service.validateToken('bad.token');
      expect(result).toBeNull();
    });
  });
});
