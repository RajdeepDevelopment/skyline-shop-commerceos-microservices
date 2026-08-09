import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Boxes } from 'lucide-react';
import { useOrderStore } from '@/modules/orders/stores/order.store';
import { productService } from '@/modules/products/services/product.service';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string }> = {
  PENDING: { color: 'text-warning bg-warning/10', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-primary bg-primary/10', icon: CheckCircle, label: 'Confirmed' },
  PROCESSING: { color: 'text-info bg-info/10', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'text-primary bg-primary/10', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-success bg-success/10', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-destructive bg-destructive/10', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const productIds = useMemo(
    () => [...new Set(orders.flatMap((o) => o.items.map((i) => i.productId)))],
    [orders],
  );

  const { data: products } = useQuery({
    queryKey: ['products', 'order-titles', productIds],
    queryFn: () => productService.getByIds(productIds, 100),
    enabled: productIds.length > 0,
  });

  const titleOf = (productId: string) =>
    products?.find((p) => p.id === productId)?.title ?? `Product ${productId.slice(0, 8)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Orders' }]} />

      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Package className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground">Track, manage and reorder your purchases</p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          className="mt-8 rounded-3xl border border-border bg-card py-20"
          icon={<Boxes className="size-10 text-muted-foreground" />}
          title="No orders yet"
          description="When you place an order, it will show up here so you can track it anytime."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

      {!isLoading && orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
            return (
              <Link
                key={order.orderId}
                to={`/orders/${order.orderId}/track`}
                className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        'flex size-11 items-center justify-center rounded-xl',
                        status.color,
                      )}
                    >
                      <StatusIcon className="size-5" />
                    </span>
                    <div>
                      <p className="font-mono font-semibold text-foreground">
                        #{order.orderId.slice(0, 8)}…
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(toPrice(order.totalAmount))}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        status.color,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <p className="text-sm text-muted-foreground">
                    {itemCount} item{itemCount > 1 ? 's' : ''} · {order.items.length} product line
                    {order.items.length > 1 ? 's' : ''}
                    {order.status !== 'CANCELLED' && (
                      <span className="ml-2 hidden sm:inline">
                        · Est. delivery by{' '}
                        {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </p>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    Track Order
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                  {order.items.map((i) => titleOf(i.productId)).join(' · ')}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
