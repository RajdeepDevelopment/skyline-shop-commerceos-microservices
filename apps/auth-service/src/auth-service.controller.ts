import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagePattern, Payload, GrpcMethod } from '@nestjs/microservices';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthServiceService, JwtPayload, TokenPair } from './auth-service.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '@app/common/dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @Post('register')
  @GrpcMethod('AuthService', 'Register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  register(@Body() _dto: RegisterDto): any {
    // Full implementation: validate, create user, hash password, return tokens
    return {
      accessToken: 'dummy-token',
      refreshToken: 'dummy-refresh',
      user: {
        id: 'user-id',
        email: _dto.email,
        role: 'user',
        firstName: _dto.firstName ?? _dto.name,
        lastName: _dto.lastName,
      },
    };
  }

  @Post('login')
  @GrpcMethod('AuthService', 'Login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  @ApiResponse({ status: 200, description: 'Returns access and refresh tokens.' })
  login(@Body() dto: LoginDto): any {
    // Full implementation: validate credentials, lookup user, generate tokens
    const payload: JwtPayload = { sub: 'user-id', email: dto.email, roles: ['user'] };
    const tokens = this.authService.generateTokens(payload);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: 'user-id',
        email: dto.email,
        role: 'user',
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh(@Body() _dto: RefreshTokenDto): { message: string } {
    // Full implementation: validate refresh token from DB, rotate it, return new pair
    return { message: 'Refresh token rotation endpoint' };
  }

  // ── gRPC handler: called by API Gateway to validate tokens ──────────────────

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(@Payload() data: { token: string }): any {
    const payload = this.authService.validateToken(data.token);
    return { valid: payload !== null, payload };
  }
}
