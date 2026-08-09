import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagePattern, Payload, GrpcMethod } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { AuthServiceService, JwtPayload } from './auth-service.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '@app/common/dto/auth.dto';
import { status } from '@grpc/grpc-js';

@ApiTags('auth')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @Post('register')
  @GrpcMethod('AuthService', 'Register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(
        dto.email,
        dto.password,
        dto.firstName ?? dto.name ?? dto.email.split('@')[0],
      );
    } catch (error: any) {
      if (error.status === 409) {
        throw new RpcException({ code: status.ALREADY_EXISTS, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @Post('login')
  @GrpcMethod('AuthService', 'Login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  @ApiResponse({ status: 200, description: 'Returns access and refresh tokens.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Email and password are required',
      });
    }
    try {
      return await this.authService.login(dto.email, dto.password);
    } catch (error: any) {
      if (error.status === 401) {
        throw new RpcException({ code: status.UNAUTHENTICATED, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  @ApiResponse({ status: 200, description: 'New token pair.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refresh(@Body() dto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(dto.refreshToken);
    } catch (error: any) {
      if (error.status === 401) {
        throw new RpcException({ code: status.UNAUTHENTICATED, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(@Payload() data: { token: string }) {
    const payload = this.authService.validateToken(data.token);
    return { valid: payload !== null, payload };
  }
}
