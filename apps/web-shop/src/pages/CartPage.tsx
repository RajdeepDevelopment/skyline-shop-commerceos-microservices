import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Trash2, Tag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { ProductImage } from '@/components/commerce/ProductImage';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { toast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    subtotal,
    discount,
    totalAmount,
    isLoading,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { add } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) void fetchCart();
  }, [fetchCart, isAuthenticated]);

  const shipping = totalAmount > 999 || totalAmount === 0 ? 0 : 49;
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          className="mt-8 rounded-3xl border border-border bg-card py-20"
          icon={<ShoppingBag className="size-10 text-muted-foreground" />}
          title="Sign in to view your cart"
          description="You need to be signed in to manage your cart and check out."
          actionLabel="Sign In"
          actionHref="/login"
        />
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-accent/60" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          className="mt-8 rounded-3xl border border-border bg-card py-20"
          icon={<ShoppingBag className="size-10 text-muted-foreground" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore our collections and find something you love."
          actionLabel="Continue Shopping"
          actionHref="/products"
        />
        <Link
          to="/deals"
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
        >
          <Tag className="size-4" /> Don't miss today's deals
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} item{itemCount > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={() => {
            void clearCart();
            toast.info('Cart cleared');
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <Trash2 className="size-4" /> Clear Cart
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const unitPrice = toPrice(item.product.price);
              const discountPct = item.product.discountPercentage || 0;
              const discountedUnit = unitPrice * (1 - discountPct / 100);
              const lineTotal = discountedUnit * item.quantity;
              const hasDiscount = discountPct > 0;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row"
                >
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <div className="flex size-28 items-center justify-center overflow-hidden rounded-xl border border-border bg-background sm:size-32">
                      <ProductImage
                        src={item.product.thumbnail || item.product.images?.[0]}
                        alt={item.product.title}
                        category="general"
                        className="h-full w-full"
                      />
                    </div>
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {item.product.brand && (
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
                            {item.product.brand}
                          </span>
                        )}
                        <Link
                          to={`/product/${item.productId}`}
                          className="block line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
                        >
                          {item.product.title}
                        </Link>
                      </div>
                      <button
                        onClick={() => void removeFromCart(item.id)}
                        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <p className="mt-1 flex items-baseline gap-2 text-sm font-bold text-foreground">
                      {hasDiscount && (
                        <span className="text-xs font-normal text-muted-foreground line-through">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      )}
                      {formatPrice(lineTotal)}
                      {hasDiscount && (
                        <span className="rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
                          {Math.round(discountPct)}% OFF
                        </span>
                      )}
                    </p>
                    {!item.product.inStock && (
                      <p className="mt-1 text-xs font-semibold text-destructive">Out of stock</p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={99}
                        onChange={(q) => void updateQuantity(item.id, q)}
                        size="sm"
                      />
                      <button
                        onClick={() => {
                          add(item.productId);
                          void removeFromCart(item.id);
                          toast.success('Moved to wishlist');
                        }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Link
            to="/products"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <ArrowRight className="size-4" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground">Price Details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Price ({itemCount} item{itemCount > 1 ? 's' : ''})
                </span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="font-semibold text-success">- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charges</span>
                <span
                  className={
                    shipping === 0 ? 'font-semibold text-success' : 'font-medium text-foreground'
                  }
                >
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                  Add {formatPrice(999 - totalAmount)} more for FREE delivery
                </p>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(totalAmount + shipping)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </Link>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-success" /> Safe & secure payments. Easy returns
              within 7 days.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
