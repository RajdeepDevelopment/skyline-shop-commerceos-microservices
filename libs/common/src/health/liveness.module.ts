import { Module, DynamicModule } from '@nestjs/common';
import { createLivenessController } from './liveness.controller';

@Module({
  controllers: [createLivenessController('api/v1/health')],
})
export class LivenessModule {
  static forRoot(options: { path?: string } = {}): DynamicModule {
    return {
      module: LivenessModule,
      controllers: [createLivenessController(options.path ?? 'api/v1/health')],
    };
  }
}
