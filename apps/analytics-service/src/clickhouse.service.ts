import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import { BehaviourEvent } from '@app/common';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS analytics.behaviour_events (
  event_id UUID DEFAULT generateUUIDv4(),
  event_type LowCardinality(String),
  user_id String,
  session_id String,
  product_id String,
  category String,
  quantity UInt32,
  payload String,
  occurred_at DateTime64(3, 'UTC')
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(occurred_at)
ORDER BY (event_type, occurred_at)`;

export function toClickHouseTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return '1970-01-01 00:00:00.000';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(
    d.getUTCHours(),
  )}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
}

@Injectable()
export class ClickHouseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ClickHouseService.name);
  private client: ClickHouseClient | null = null;
  private available = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const url = this.configService.get('CLICKHOUSE_URL', 'http://localhost:8123');
    try {
      this.client = createClient({
        url,
        request_timeout: 10_000,
        max_open_connections: 5,
      });
      await this.client.ping();
      await this.client.command({ query: 'CREATE DATABASE IF NOT EXISTS analytics' });
      await this.client.command({ query: SCHEMA });
      this.available = true;
      this.logger.log(`ClickHouse connected: ${url}`);
    } catch (error) {
      this.logger.warn(`ClickHouse unavailable (${url}): ${(error as Error).message}`);
      this.client = null;
      this.available = false;
    }
  }

  get isAvailable(): boolean {
    return this.available && !!this.client;
  }

  async insertEvent(event: BehaviourEvent): Promise<void> {
    if (!this.isAvailable) return;
    try {
      await this.client!.insert({
        table: 'analytics.behaviour_events',
        format: 'JSONEachRow',
        values: [
          {
            event_type: event.eventType,
            user_id: event.userId || '',
            session_id: event.sessionId || '',
            product_id: event.productId || '',
            category: event.category || '',
            quantity: event.quantity || 0,
            payload: event.payload ? JSON.stringify(event.payload) : '',
            occurred_at: toClickHouseTime(event.timestamp),
          },
        ],
      });
    } catch (error) {
      this.logger.warn(`ClickHouse insert failed: ${(error as Error).message}`);
    }
  }

  async query<T = Record<string, any>>(query: string): Promise<T[]> {
    if (!this.isAvailable) return [];
    try {
      const rs = await this.client!.query({ query, format: 'JSONEachRow' });
      return await rs.json();
    } catch (error) {
      this.logger.warn(`ClickHouse query failed: ${(error as Error).message}`);
      return [];
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client?.close();
    } catch {
      /* noop */
    }
  }
}
