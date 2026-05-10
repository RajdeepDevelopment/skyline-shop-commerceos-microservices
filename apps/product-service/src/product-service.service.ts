import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, DatabaseService } from '@app/database';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

@Injectable()
export class ProductServiceService implements OnModuleInit {
  private shardB: PrismaClient;

  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shardBUrl = this.configService.get<string>('PRODUCT_DATABASE_SHARD_B_URL');
    if (shardBUrl) {
      const pool = new pg.Pool({ connectionString: shardBUrl });
      const adapter = new PrismaPg(pool);
      this.shardB = new PrismaClient({ adapter });
      await this.shardB.$connect();
    }
  }

  /**
   * Determine which shard to use based on SKU or ID.
   * Simple Sharding Logic: Even SKUs to Shard A, Odd to Shard B.
   */
  private getShard(key: string): PrismaClient {
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 2 === 0 ? this.prisma : this.shardB;
  }

  async create(data: any) {
    const shard = this.getShard(data.sku || 'default');

    return shard.product.create({ data });
  }

  async findAll() {
    // SCALABILITY: Parallel reads from replicas across ALL shards
    const [resultsA, resultsB] = await Promise.all([
      this.prisma.product.findMany({ where: { isActive: true }, include: { category: true } }),
      this.shardB
        ? this.shardB.product.findMany({ where: { isActive: true }, include: { category: true } })
        : Promise.resolve([]),
    ]);
    return [...resultsA, ...resultsB];
  }

  async findOne(id: string) {
    // HA: Try Shard A, if not found try Shard B (Failover/Search across shards)
    let product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, inventory: true },
    });

    if (!product && this.shardB) {
      product = await this.shardB.product.findUnique({
        where: { id },
        include: { category: true, inventory: true },
      });
    }
    return product;
  }

  async update(id: string, data: any) {
    // For updates, we search both and update the correct one
    try {
      return await this.prisma.product.update({ where: { id }, data });
    } catch {
      if (this.shardB) return this.shardB.product.update({ where: { id }, data });
      throw new Error('Product not found on any shard');
    }
  }

  async remove(id: string) {
    return this.update(id, { isActive: false });
  }
}
