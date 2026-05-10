import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthServiceService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Sign an access + refresh token pair.
   * Refresh token rotation: each refresh generates a new pair.
   */
  generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = this.jwtService.sign(payload);
    // Refresh token is a secure random token (stored in DB for rotation)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    return { accessToken, refreshToken };
  }

  /**
   * Validate a JWT token and return its payload.
   */
  validateToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  /**
   * Hash a password using SHA-256 + salt (use bcrypt in real production).
   */
  hashPassword(password: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  }

  /**
   * Generate a cryptographically random salt.
   */
  generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
