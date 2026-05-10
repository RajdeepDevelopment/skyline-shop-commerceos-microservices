import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { EncryptionService } from './utils/encryption.service';

@Module({
  providers: [CommonService, EncryptionService],
  exports: [CommonService, EncryptionService],
})
export class CommonModule {}
