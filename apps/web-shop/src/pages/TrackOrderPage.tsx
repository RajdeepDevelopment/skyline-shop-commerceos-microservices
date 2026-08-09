import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useOrderStore } from '@/modules/orders/stores/order.store';
import { productService } from '@/modules/products/services/product.service';
import type { Product } from '@/modules/products/types/product.types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductImage } from '@/components/commerce/ProductImage';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string }> = {
  PENDING: { color: 'text-warning bg-warning/10', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-primary bg-primary/10', icon: CheckCircle, label: 'Confirmed' },
  PROCESSING: { color: 'text-info bg-info/10', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'text-primary bg-primary/10', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-success bg-success/10', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-destructive bg-destructive/10', icon: XCircle, label: 'Cancelled' },
};

export default function TrackOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedOrder: order, isLoading, error, fetchOrder } = useOrderStore();

  useEffect(() => {
    if (id) void fetchOrder(id);
  }, [id, fetchOrder]);

  const { data: productMap } = useQuery({
    queryKey: ['order', 'products', order?.orderId],
    queryFn: async (): Promise<Map<string, Product>> => {
      const ids = order?.items.map((i) => i.productId) ?? [];
      if (ids.length === 0) return new Map<string, Product>();
      const products = await productService.getByIds(ids, ids.length);
      return new Map(products.map((p) => [p.id, p]));
    },
    enabled: !!order && order.items.length > 0,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-8 w-56 animate-pulse rounded bg-accent/60" />
        <div className="mt-6 h-40 animate-pulse rounded-3xl border border-border bg-card" />
        <div className="mt-6 h-32 animate-pulse rounded-3xl border border-border bg-card" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Package className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || 'We could not find this order.'}
        </p>
        <Link
          to="/orders"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const config = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  const itemsWithProducts = order.items.map((item) => ({
    item,
    product: productMap?.get(item.productId),
  }));
  const returnPolicies = [
    ...new Set(
      itemsWithProducts
        .map(({ product }) => product?.returnPolicy)
        .filter((p): p is string => Boolean(p?.trim())),
    ),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Orders', to: '/orders' },
          { label: `Order #${order.orderId.slice(0, 8)}` },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground">
            Order #{order.orderId.slice(0, 8)}…
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(toPrice(order.totalAmount))}
          </p>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
              config.color,
            )}
          >
            <StatusIcon className="size-3.5" /> {config.label}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const sc = statusConfig[step];
              const StepIcon = sc.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step} className="flex flex-1 flex-col items-center">
                  <div className="relative flex w-full items-center justify-center">
                    {index > 0 && (
                      <span
                        className={cn(
                          'absolute right-1/2 top-1/2 h-1 w-full -translate-y-1/2 rounded',
                          index <= currentStepIndex ? 'bg-primary' : 'bg-border',
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-colors',
                        isCompleted
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground',
                        isCurrent && 'ring-4 ring-primary/20',
                      )}
                    >
                      <StepIcon className="size-4" />
                    </div>
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-center text-[11px] font-semibold sm:text-xs',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <XCircle className="mx-auto size-10 text-destructive" />
          <p className="mt-2 text-lg font-bold text-foreground">Order Cancelled</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your refund of {formatPrice(toPrice(order.totalAmount))} will be processed within 5-7
            business days.
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Shipping address */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MapPin className="size-4 text-primary" /> Delivery Address
          </p>
          {order.shippingAddress?.trim() ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {order.shippingAddress}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No delivery address on file for this order.
            </p>
          )}
        </div>

        {/* Returns */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <RotateCcw className="size-4 text-success" /> Returns & Refunds
          </p>
          {returnPolicies.length > 0 ? (
            <div className="mt-3 space-y-3">
              {returnPolicies.map((policy) => (
                <div key={policy}>
                  <p className="text-xs font-semibold text-foreground">
                    {itemsWithProducts
                      .filter(({ product }) => product?.returnPolicy === policy)
                      .map(({ product }) => product?.title)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{policy}</p>
                </div>
              ))}
              <p className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3.5 text-success" /> Refunds are credited back to the
                original payment method.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You can request a return or replacement within 7 days of delivery. Refunds are
              credited back to the original payment method.
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-bold text-foreground">Items ({itemCount})</p>
        </div>
        <div className="divide-y divide-border/60">
          {order.items.map((item, index) => {
            const product = productMap?.get(item.productId);
            return (
              <div key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <ProductImage
                    src={product?.thumbnail || product?.images?.[0]}
                    alt={product?.title ?? 'Product'}
                    category={product?.category ?? 'general'}
                    className="size-10 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product?.title ?? `Product ${item.productId.slice(0, 10)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatPrice(toPrice(item.price) * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-4">
          <span className="text-sm font-semibold text-muted-foreground">Order Total</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(toPrice(order.totalAmount))}
          </span>
        </div>
      </div>

      <Link
        to="/orders"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to My Orders
      </Link>
    </div>
  );
}
