import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@app/database';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

interface LoginAttemptTracker {
  count: number;
  lastAttempt: number;
}

@Injectable()
export class AuthServiceService {
  private readonly logger = new Logger(AuthServiceService.name);
  private loginAttempts = new Map<string, LoginAttemptTracker>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: DatabaseService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        roles: ['user'],
        isActive: true,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const tokens = this.generateTokens(payload);

    await this.prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles[0] || 'user',
      },
    };
  }

  async login(email: string, password: string) {
    this.checkLoginRateLimit(email);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.recordFailedLogin(email);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.recordFailedLogin(email);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.clearLoginAttempts(email);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const tokens = this.generateTokens(payload);

    await this.prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    this.logger.log(`User ${email} logged in successfully`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roles[0] || 'user',
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const payload: JwtPayload = {
      sub: storedToken.user.id,
      email: storedToken.user.email,
      roles: storedToken.user.roles,
    };

    const tokens = this.generateTokens(payload);

    await this.prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomBytes(64).toString('hex');
    return { accessToken, refreshToken };
  }

  validateToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  private checkLoginRateLimit(email: string) {
    const tracker = this.loginAttempts.get(email);
    if (!tracker) return;

    if (
      tracker.count >= MAX_LOGIN_ATTEMPTS &&
      Date.now() - tracker.lastAttempt < LOCKOUT_DURATION_MS
    ) {
      const remainingSeconds = Math.ceil(
        (LOCKOUT_DURATION_MS - (Date.now() - tracker.lastAttempt)) / 1000,
      );
      throw new UnauthorizedException(
        `Too many login attempts. Try again in ${remainingSeconds} seconds`,
      );
    }

    if (Date.now() - tracker.lastAttempt >= LOCKOUT_DURATION_MS) {
      this.loginAttempts.delete(email);
    }
  }

  private recordFailedLogin(email: string) {
    const tracker = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    tracker.count++;
    tracker.lastAttempt = Date.now();
    this.loginAttempts.set(email, tracker);
    this.logger.warn(`Failed login attempt for ${email} (attempt ${tracker.count})`);
  }

  private clearLoginAttempts(email: string) {
    this.loginAttempts.delete(email);
  }
}
