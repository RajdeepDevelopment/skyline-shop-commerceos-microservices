import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { Public } from '../guards/jwt-auth.guard';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@app/database';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
  ) {}

  @Get()
  @Public() // Make health check public
  @HealthCheck()
  check() {
    return this.health.check([
      // Database health

      () => this.prismaHealth.pingCheck('database', this.prisma as any),

      // Redis health
      () =>
        this.microservice.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            host: this.configService.get('REDIS_HOST', 'localhost'),

            port: this.configService.get('REDIS_PORT', 6379),
          },
        }),

      // NATS health
      () =>
        this.microservice.pingCheck('nats', {
          transport: Transport.NATS,
          options: {
            servers: [this.configService.get('NATS_URL', 'nats://localhost:4222')],
          },
        }),
    ]);
  }
}
