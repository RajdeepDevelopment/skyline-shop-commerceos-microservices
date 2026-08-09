/**
 * SKU -> shard hashing.
 *
 * MUST stay byte-for-byte identical to `DatabaseService` in
 * libs/database/src/database.service.ts so that seeded rows land on the same
 * physical shard the application reads from (`getShard(sku) % shardCount`).
 */

export function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function shardIndex(sku: string, shardCount: number): number {
  if (shardCount <= 1) return 0;
  return hashKey(sku) % shardCount;
}
