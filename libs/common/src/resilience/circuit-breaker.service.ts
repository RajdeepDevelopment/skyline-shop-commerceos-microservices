import { Injectable, Logger } from '@nestjs/common';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/**
 * Software circuit breaker for gRPC inter-service calls.
 *
 * When failures exceed the threshold, the circuit opens and
 * rejects requests immediately for the reset timeout period.
 * After the timeout, it enters HALF_OPEN and allows a single
 * probe request. If it succeeds, the circuit closes.
 *
 * For production, prefer Istio/Linkerd circuit breakers.
 * This is a safety net for environments without a service mesh.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, CircuitBreakerState>();

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(options?: { failureThreshold?: number; resetTimeoutMs?: number }) {
    this.failureThreshold = options?.failureThreshold ?? 5;
    this.resetTimeoutMs = options?.resetTimeoutMs ?? 30000;
  }

  async execute<T>(serviceKey: string, fn: () => Promise<T>): Promise<T> {
    const state = this.getState(serviceKey);

    if (state.state === 'OPEN') {
      if (Date.now() - state.lastFailureTime >= this.resetTimeoutMs) {
        state.state = 'HALF_OPEN';
        this.logger.warn(`Circuit HALF_OPEN for ${serviceKey}`);
      } else {
        throw new Error(
          `Circuit breaker OPEN for ${serviceKey}. Retry after ${this.resetTimeoutMs}ms`,
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess(serviceKey);
      return result;
    } catch (error) {
      this.onFailure(serviceKey);
      throw error;
    }
  }

  private getState(serviceKey: string): CircuitBreakerState {
    if (!this.circuits.has(serviceKey)) {
      this.circuits.set(serviceKey, {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED',
      });
    }
    return this.circuits.get(serviceKey)!;
  }

  private onSuccess(serviceKey: string): void {
    const state = this.getState(serviceKey);
    state.failures = 0;
    state.state = 'CLOSED';
  }

  private onFailure(serviceKey: string): void {
    const state = this.getState(serviceKey);
    state.failures++;
    state.lastFailureTime = Date.now();

    if (state.failures >= this.failureThreshold) {
      state.state = 'OPEN';
      this.logger.warn(`Circuit OPEN for ${serviceKey} after ${state.failures} failures`);
    }
  }

  getStateInfo(serviceKey: string): CircuitBreakerState {
    return { ...this.getState(serviceKey) };
  }
}
