import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@app/database';
import { createHash } from 'crypto';

export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

/**
 * Idempotency interceptor for write APIs.
 *
 * Stores request fingerprints in an idempotency table keyed by the
 * client-supplied Idempotency-Key header. Duplicate requests within
 * the TTL window return the cached response instead of re-executing.
 *
 * Table schema (added via migration):
 *   CREATE TABLE idempotency_keys (
 *     key         TEXT PRIMARY KEY,
 *     request_hash TEXT NOT NULL,
 *     response    JSONB,
 *     status      TEXT DEFAULT 'pending',
 *     created_at  TIMESTAMPTZ DEFAULT NOW(),
 *     expires_at  TIMESTAMPTZ NOT NULL
 *   );
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const idempotencyKey = request.headers[IDEMPOTENCY_KEY_HEADER] as string | undefined;

    if (!idempotencyKey) {
      return next.handle();
    }

    // Compute a fingerprint of the request to detect changed payloads
    const requestHash = this.hashRequest(request);

    const now = new Date();
    const ttlMs = 24 * 60 * 60 * 1000; // 24h TTL
    const expiresAt = new Date(now.getTime() + ttlMs);

    try {
      const existing = await (this.prisma as any).idempotencyKey.findUnique({
        where: { key: idempotencyKey },
      });

      if (existing) {
        // If same payload, return cached response
        if (existing.requestHash === requestHash && existing.status === 'completed') {
          this.logger.debug(`Idempotent hit: ${idempotencyKey}`);
          response.setHeader('Idempotent-Replayed', 'true');
          return of(existing.response);
        }

        // If same key but different payload, reject
        if (existing.requestHash !== requestHash) {
          throw new ConflictException(
            `Idempotency key "${idempotencyKey}" was used with a different request body`,
          );
        }

        // If still pending (in-flight), reject to prevent concurrent duplicate
        if (existing.status === 'pending') {
          throw new ConflictException(
            `Request with idempotency key "${idempotencyKey}" is still being processed`,
          );
        }
      }

      // Create pending record
      await (this.prisma as any).idempotencyKey.upsert({
        where: { key: idempotencyKey },
        create: {
          key: idempotencyKey,
          requestHash,
          status: 'pending',
          expiresAt,
        },
        update: {
          requestHash,
          status: 'pending',
          expiresAt,
        },
      });

      return next.handle().pipe(
        tap(async (result) => {
          try {
            await (this.prisma as any).idempotencyKey.update({
              where: { key: idempotencyKey },
              data: {
                status: 'completed',
                response: result,
              },
            });
          } catch (err) {
            this.logger.error(`Failed to store idempotent response: ${(err as Error).message}`);
          }
        }),
        catchError(async (error) => {
          // Clean up pending record on error
          try {
            await (this.prisma as any).idempotencyKey.delete({
              where: { key: idempotencyKey },
            });
          } catch {
            // Ignore cleanup errors
          }
          throw error;
        }),
      );
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error(`Idempotency check failed: ${(error as Error).message}`);
      return next.handle();
    }
  }

  private hashRequest(request: any): string {
    const data = JSON.stringify({
      method: request.method,
      url: request.url,
      body: request.body,
      user: request.user?.sub,
    });
    // Simple hash using built-in crypto
    return createHash('sha256').update(data).digest('hex');
  }
}
