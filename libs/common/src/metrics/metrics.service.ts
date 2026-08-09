import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly logger = new Logger(MetricsService.name);
  readonly registry: Registry;

  readonly httpRequestsTotal: Counter<string>;
  readonly httpRequestDuration: Histogram<string>;
  readonly grpcRequestsTotal: Counter<string>;
  readonly grpcRequestDuration: Histogram<string>;
  readonly activeConnections: Gauge<string>;
  readonly ordersCreatedTotal: Counter<string>;
  readonly productsSearchedTotal: Counter<string>;
  readonly cacheHitsTotal: Counter<string>;
  readonly cacheMissesTotal: Counter<string>;

  constructor() {
    this.registry = new Registry();

    collectDefaultMetrics({ register: this.registry, prefix: 'ecommerce_' });

    this.httpRequestsTotal = new Counter({
      name: 'ecommerce_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'service'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'ecommerce_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code', 'service'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.grpcRequestsTotal = new Counter({
      name: 'ecommerce_grpc_requests_total',
      help: 'Total number of gRPC requests',
      labelNames: ['service', 'method', 'status_code'],
      registers: [this.registry],
    });

    this.grpcRequestDuration = new Histogram({
      name: 'ecommerce_grpc_request_duration_seconds',
      help: 'gRPC request duration in seconds',
      labelNames: ['service', 'method', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.activeConnections = new Gauge({
      name: 'ecommerce_active_connections',
      help: 'Number of active connections',
      labelNames: ['service'],
      registers: [this.registry],
    });

    this.ordersCreatedTotal = new Counter({
      name: 'ecommerce_orders_created_total',
      help: 'Total number of orders created',
      labelNames: ['service', 'status'],
      registers: [this.registry],
    });

    this.productsSearchedTotal = new Counter({
      name: 'ecommerce_products_searched_total',
      help: 'Total number of product searches',
      labelNames: ['service', 'has_query'],
      registers: [this.registry],
    });

    this.cacheHitsTotal = new Counter({
      name: 'ecommerce_cache_hits_total',
      help: 'Total number of cache hits',
      labelNames: ['service', 'cache_type'],
      registers: [this.registry],
    });

    this.cacheMissesTotal = new Counter({
      name: 'ecommerce_cache_misses_total',
      help: 'Total number of cache misses',
      labelNames: ['service', 'cache_type'],
      registers: [this.registry],
    });
  }

  onModuleInit() {
    this.logger.log('Metrics service initialized');
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  async getContentType(): Promise<string> {
    return this.registry.contentType;
  }
}
