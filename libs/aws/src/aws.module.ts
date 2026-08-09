import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsConfigService } from './aws-config.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AwsConfigService, ConfigService],
  exports: [AwsConfigService, ConfigModule],
})
export class AwsModule {}
