import { ClickHouseService, toClickHouseTime } from './clickhouse.service';
import { BehaviourEventType } from '../../../libs/common/src/events';

jest.mock('@clickhouse/client', () => {
  const mockClient: any = {
    ping: jest.fn().mockResolvedValue('Ok.'),
    command: jest.fn().mockResolvedValue({}),
    insert: jest.fn().mockResolvedValue({}),
    query: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue([]) }),
    close: jest.fn().mockResolvedValue(undefined),
  };
  return {
    createClient: jest.fn(() => mockClient),
  };
});

import { createClient } from '@clickhouse/client';

describe('toClickHouseTime', () => {
  it('formats ISO strings in UTC millisecond precision', () => {
    expect(toClickHouseTime('2026-08-09T10:30:15.123Z')).toBe('2026-08-09 10:30:15.123');
  });

  it('falls back to epoch for invalid dates', () => {
    expect(toClickHouseTime('not-a-date')).toBe('1970-01-01 00:00:00.000');
  });

  it('defaults to now when no timestamp is supplied', () => {
    const now = toClickHouseTime();
    expect(now).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
  });
});

describe('ClickHouseService', () => {
  let service: ClickHouseService;

  beforeEach(() => {
    jest.clearAllMocks();
    const config = { get: (key: string, def?: unknown) => def } as any;
    service = new ClickHouseService(config);
  });

  function getClient() {
    return createClient() as any;
  }

  describe('onModuleInit', () => {
    it('creates the analytics database and schema table', async () => {
      await service.onModuleInit();
      expect(createClient).toHaveBeenCalled();
      const client = getClient();
      expect(client.ping).toHaveBeenCalled();
      expect(client.command).toHaveBeenCalledWith({
        query: 'CREATE DATABASE IF NOT EXISTS analytics',
      });
      const tableCall = client.command.mock.calls.find((c: any) =>
        c[0].query.includes('CREATE TABLE IF NOT EXISTS analytics.behaviour_events'),
      );
      expect(tableCall).toBeDefined();
      expect(service.isAvailable).toBe(true);
    });
  });

  describe('insertEvent', () => {
    it('inserts a behaviour event as JSONEachRow', async () => {
      await service.onModuleInit();
      await service.insertEvent({
        eventType: BehaviourEventType.PRODUCT_VIEW,
        userId: 'u1',
        sessionId: 's1',
        productId: 'p1',
        category: 'electronics',
        quantity: 1,
        payload: { ref: 'home' },
        timestamp: '2026-08-09T10:00:00.000Z',
      });

      const client = getClient();
      expect(client.insert).toHaveBeenCalledWith({
        table: 'analytics.behaviour_events',
        format: 'JSONEachRow',
        values: [
          {
            event_type: 'PRODUCT_VIEW',
            user_id: 'u1',
            session_id: 's1',
            product_id: 'p1',
            category: 'electronics',
            quantity: 1,
            payload: '{"ref":"home"}',
            occurred_at: '2026-08-09 10:00:00.000',
          },
        ],
      });
    });
  });
});
