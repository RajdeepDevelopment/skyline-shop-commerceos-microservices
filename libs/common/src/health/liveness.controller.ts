import { Controller, Get } from '@nestjs/common';

export function createLivenessController(path: string = 'api/v1/health') {
  @Controller(path)
  class LivenessController {
    @Get()
    check() {
      return {
        status: 'ok',
        service: process.env.SERVICE_NAME ?? 'unknown',
        version: process.env.SERVICE_VERSION ?? 'latest',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      };
    }
  }
  return LivenessController;
}
