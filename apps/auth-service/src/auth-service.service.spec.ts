import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-1', email: 'test@test.com', roles: ['user'] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceService, { provide: JwtService, useValue: mockJwtService }],
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

  describe('hashPassword', () => {
    it('should return a deterministic hash for same input', () => {
      const hash1 = service.hashPassword('password123', 'salt');
      const hash2 = service.hashPassword('password123', 'salt');
      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different passwords', () => {
      const hash1 = service.hashPassword('password1', 'salt');
      const hash2 = service.hashPassword('password2', 'salt');
      expect(hash1).not.toBe(hash2);
    });
  });
});
