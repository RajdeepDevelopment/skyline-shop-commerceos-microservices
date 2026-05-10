import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import * as pg from 'pg';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public readonly $replica: PrismaClient;

  constructor(private configService: ConfigService) {
    const serviceName = configService.get<string>('SERVICE_NAME');
    let writeUrl = configService.get<string>('DATABASE_URL');
    let readUrl = writeUrl;

    if (serviceName) {
      const specificWriteUrl =
        configService.get<string>(`${serviceName.toUpperCase()}_DATABASE_WRITE_URL`) ||
        configService.get<string>(`${serviceName.toUpperCase()}_DATABASE_URL`);
      const specificReadUrl =
        configService.get<string>(`${serviceName.toUpperCase()}_DATABASE_READ_URL`) ||
        specificWriteUrl;

      if (specificWriteUrl) writeUrl = specificWriteUrl;
      if (specificReadUrl) readUrl = specificReadUrl;
    }

    // Master Pool (Writes)
    const masterPool = new pg.Pool({ connectionString: writeUrl });
    const masterAdapter = new PrismaPg(masterPool);

    super({
      adapter: masterAdapter,
      log: configService.get<string>('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
    });

    // Replica Pool (Reads)
    const replicaPool = new pg.Pool({ connectionString: readUrl });
    const replicaAdapter = new PrismaPg(replicaPool);
    this.$replica = new PrismaClient({ adapter: replicaAdapter });
  }

  async onModuleInit() {
    await Promise.all([this.$connect(), this.$replica.$connect()]);
  }

  async onModuleDestroy() {
    await Promise.all([this.$disconnect(), this.$replica.$disconnect()]);
  }
}
