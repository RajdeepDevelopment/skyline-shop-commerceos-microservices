import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Truck } from 'lucide-react';
import type { Product } from '@/modules/products/types/product.types';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { toast } from '@/components/ui/toast';
import { StarRating } from '@/components/ui/star-rating';
import { Price } from '@/components/ui/price';
import { cn, toPrice } from '@/lib/utils';
import { getDeliveryPromise } from '@/lib/product-content';
import { ProductImage } from './ProductImage';

export interface ProductCardProps {
  product: Product;
  className?: string;
  layout?: 'grid' | 'list';
  index?: number;
}

export function ProductCard({ product, className, layout = 'grid' }: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const price = toPrice(product.price);
  const discount = toPrice(product.discountPercentage);
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const outOfStock = !product.inStock;
  const wished = isWishlisted(product.id);
  const delivery = getDeliveryPromise(product);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    if (!wished) toast.success('Added to wishlist', product.title);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    void addToCart(product.id, 1);
    toast.success('Added to cart', product.title);
  };

  if (layout === 'list') {
    return (
      <div
        className={cn(
          'group relative flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40',
          className,
        )}
      >
        <Link
          to={`/product/${product.id}`}
          className="relative block h-36 w-36 shrink-0 overflow-hidden rounded-lg"
        >
          <ProductImage
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            category={product.category}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            to={`/product/${product.id}`}
            className="line-clamp-2 font-medium text-foreground transition-colors hover:text-primary"
          >
            {product.title}
          </Link>
          <StarRating value={product.rating} showValue size="sm" className="mt-1" />
          <Price
            price={discountedPrice}
            mrp={price}
            discount={discount}
            size="sm"
            className="mt-2"
          />
          <div className="mt-auto flex items-center gap-2 pt-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <ShoppingCart className="size-4" />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-lg border border-border transition-colors',
                wished
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                  : 'text-muted-foreground hover:text-rose-500',
              )}
            >
              <Heart className={cn('size-4', wished && 'fill-rose-500')} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('group h-full', className)}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-primary/40">
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-square overflow-hidden bg-background-elevated"
        >
          <ProductImage
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            category={product.category}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {discount > 0 && !outOfStock && (
            <span className="absolute left-2 top-2 rounded bg-destructive px-1.5 py-0.5 text-[11px] font-bold text-white">
              {Math.round(discount)}% OFF
            </span>
          )}

          <button
            onClick={handleWishlist}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute right-2 top-2 flex size-8 items-center justify-center rounded-full border transition-colors',
              wished
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                : 'border-border bg-background/90 text-muted-foreground hover:text-rose-500',
            )}
          >
            <Heart className={cn('size-4 transition-colors', wished && 'fill-rose-500')} />
          </button>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
              <span className="rounded-full border border-white/30 bg-foreground/50 px-3 py-1 text-xs font-semibold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          {product.brand && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {product.brand}
            </span>
          )}
          <Link
            to={`/product/${product.id}`}
            className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary"
          >
            {product.title}
          </Link>

          <StarRating value={product.rating} size="xs" showValue />

          <div className="mt-auto pt-1.5">
            <Price price={discountedPrice} mrp={price} discount={discount} size="sm" showSave />
          </div>

          {!outOfStock && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Truck className="size-3.5 text-success" />
              {delivery.label}
            </span>
          )}

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'mt-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors',
              outOfStock
                ? 'cursor-not-allowed bg-accent text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <ShoppingCart className="size-4" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
