import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseService, { provide: 'PRISMA_CLIENT', useExisting: DatabaseService }],
  exports: [DatabaseService, 'PRISMA_CLIENT'],
})
export class DatabaseModule {}
