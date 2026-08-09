import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from './generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import * as pg from 'pg';

export interface ShardConnection {
  client: PrismaClient;
  replica: PrismaClient;
}

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  public readonly $replica: PrismaClient;
  public readonly shards: Map<string, ShardConnection> = new Map();

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

    const masterPool = new pg.Pool({ connectionString: writeUrl, max: 20 });
    const masterAdapter = new PrismaPg(masterPool);

    super({
      adapter: masterAdapter,
      log: configService.get<string>('NODE_ENV') === 'development' ? ['error'] : ['error'],
    });

    const replicaPool = new pg.Pool({ connectionString: readUrl, max: 30 });
    const replicaAdapter = new PrismaPg(replicaPool);
    this.$replica = new PrismaClient({ adapter: replicaAdapter });
  }

  async onModuleInit() {
    await Promise.all([this.$connect(), this.$replica.$connect()]);
    await this.initShards();
  }

  private async initShards() {
    const serviceName = this.configService.get<string>('SERVICE_NAME');
    if (!serviceName) return;

    const prefix = serviceName.toUpperCase();
    let shardCount = 0;

    while (true) {
      const writeUrl = this.configService.get<string>(
        `${prefix}_S${shardCount}_DATABASE_WRITE_URL`,
      );
      if (!writeUrl) break;

      const readUrl =
        this.configService.get<string>(`${prefix}_S${shardCount}_DATABASE_READ_URL`) || writeUrl;

      try {
        const pool = new pg.Pool({ connectionString: writeUrl, max: 15 });
        const adapter = new PrismaPg(pool);
        const client = new PrismaClient({ adapter });

        const replicaPool = new pg.Pool({ connectionString: readUrl, max: 20 });
        const replicaAdapter = new PrismaPg(replicaPool);
        const replica = new PrismaClient({ adapter: replicaAdapter });

        await Promise.all([client.$connect(), replica.$connect()]);
        this.shards.set(`s${shardCount}`, { client, replica });
        this.logger.log(`Shard ${prefix}_S${shardCount} connected (write + replica)`);
      } catch (error) {
        this.logger.warn(
          `Shard ${prefix}_S${shardCount} connection failed: ${(error as Error).message}`,
        );
      }
      shardCount++;
    }

    if (shardCount > 0) {
      this.logger.log(`Initialized ${shardCount} shards for ${serviceName}`);
    }
  }

  getShard(key: string, useReplica = false): PrismaClient {
    const shardCount = this.shards.size;
    if (shardCount === 0) return useReplica ? this.$replica : this;

    const hash = this.hashKey(key);
    const shardIndex = hash % shardCount;
    const shard = this.shards.get(`s${shardIndex}`);
    if (!shard) return useReplica ? this.$replica : this;

    return useReplica ? shard.replica : shard.client;
  }

  getAllShards(useReplica = false): PrismaClient[] {
    if (this.shards.size === 0) return [useReplica ? this.$replica : this];
    return Array.from(this.shards.values()).map((s) => (useReplica ? s.replica : s.client));
  }

  private hashKey(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  async onModuleDestroy() {
    const disconnects = [this.$disconnect(), this.$replica.$disconnect()];
    for (const [, shard] of this.shards) {
      disconnects.push(shard.client.$disconnect(), shard.replica.$disconnect());
    }
    await Promise.all(disconnects);
  }
}
