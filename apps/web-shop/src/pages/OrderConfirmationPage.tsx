import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { orderService } from '@/modules/orders/services/order.service';
import { productService } from '@/modules/products/services/product.service';
import { ProductImage } from '@/components/commerce/ProductImage';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

export interface OrderSummaryState {
  orderId: string;
  address?: {
    name: string;
    line: string;
    city: string;
    phone: string;
  };
  paymentMethod?: string;
}

interface DisplayItem {
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    title: string;
    images: string[];
    thumbnail: string | null;
    category: string;
  };
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, subtotal, discount, totalAmount, clearCart } = useCartStore();

  const state = (location.state as OrderSummaryState | null) ?? null;

  useEffect(() => {
    if (state) {
      void clearCart();
    }
  }, [state, clearCart]);

  const { data: order, isFetching: orderLoading } = useQuery({
    queryKey: ['order', 'detail', state?.orderId],
    queryFn: () => orderService.getOrder(state!.orderId),
    enabled: !!state?.orderId,
    retry: 1,
  });

  const fallbackItems: DisplayItem[] = useMemo(
    () =>
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: toPrice(i.product.price) * (1 - i.product.discountPercentage / 100),
        product: i.product,
      })),
    [items],
  );

  const fetchedItems: DisplayItem[] = useMemo(
    () =>
      order?.items?.length
        ? order.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: toPrice(i.price),
          }))
        : [],
    [order],
  );

  const displayItems = fetchedItems.length > 0 ? fetchedItems : fallbackItems;

  const productIds = useMemo(
    () => [...new Set(displayItems.map((i) => i.productId))],
    [displayItems],
  );

  const { data: products } = useQuery({
    queryKey: ['products', 'byIds', productIds],
    queryFn: () => productService.getByIds(productIds),
    enabled: productIds.length > 0,
  });

  const productMap = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products]);

  const enrichedItems: DisplayItem[] = useMemo(
    () =>
      displayItems.map((i) => ({
        ...i,
        product: i.product ?? productMap.get(i.productId),
      })),
    [displayItems, productMap],
  );

  const itemsTotal = useMemo(
    () => enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [enrichedItems],
  );

  const orderTotal = order ? Number(order.totalAmount) || 0 : totalAmount;
  const effectiveSubtotal = order ? itemsTotal : subtotal;
  const effectiveDiscount = order ? Math.max(0, itemsTotal - orderTotal) : discount;
  const shipping = orderTotal > 999 ? 0 : 49;

  if (!state) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">No recent order found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find an order to confirm. Browse the catalog and place your first order.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          <Home className="size-4" /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Success hero */}
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="size-11 text-success" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-foreground">Order Placed Successfully!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you for shopping with SkylineShop. Your order confirmation has been sent to your
          email and phone.
        </p>
      </div>

      {/* Order card */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/5 px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="font-mono text-lg font-bold text-foreground">#{state.orderId}</p>
            {orderLoading && !order && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Confirming details…
              </p>
            )}
          </div>
          <Link
            to={`/orders/${state.orderId}/track`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Truck className="size-4" /> Track Order
          </Link>
        </div>

        {/* Items */}
        <div className="divide-y divide-border/60 px-6">
          {enrichedItems.length > 0 ? (
            enrichedItems.map((i) => (
              <div key={i.productId} className="flex items-center gap-4 py-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                  <ProductImage
                    src={i.product?.thumbnail || i.product?.images?.[0]}
                    alt={i.product?.title || 'Product'}
                    category={i.product?.category}
                    className="h-full w-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${i.productId}`}
                    className="line-clamp-1 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {i.product?.title || 'Product'}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">Qty: {i.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              {orderLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Loading order items…
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" /> Order items unavailable right now
                </>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2 border-t border-border bg-muted/30 px-6 py-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Items total</span>
            <span>{formatPrice(effectiveSubtotal)}</span>
          </div>
          {effectiveDiscount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span className="text-success">- {formatPrice(effectiveDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
            <span>Total</span>
            <span>{formatPrice(orderTotal + shipping)}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Truck className="size-4 text-primary" /> Delivery Address
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">{state.address?.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.address?.line}</p>
          <p className="text-sm text-muted-foreground">{state.address?.city}</p>
          <p className="text-sm text-muted-foreground">{state.address?.phone}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="size-4 text-primary" /> Payment
          </p>
          <p className="mt-3 text-sm text-foreground">{state.paymentMethod}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Estimated delivery: 2-4 business days
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Package className="size-4" /> View My Orders
        </button>
        <Link
          to="/products"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Continue Shopping <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
