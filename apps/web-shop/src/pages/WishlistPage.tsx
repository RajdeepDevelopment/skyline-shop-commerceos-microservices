import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Trash2, ChevronRight } from 'lucide-react';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { productService } from '@/modules/products/services/product.service';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductGridSkeleton } from '@/components/commerce/ProductCardSkeleton';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function WishlistPage() {
  const { items, clear } = useWishlistStore();
  const ids = items.map((i) => i.productId);

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'by-ids', ids],
    queryFn: () => productService.getByIds(ids, 50),
    enabled: ids.length > 0,
  });

  const products = (data ?? []).filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <Heart className="size-5 fill-rose-500" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-sm text-muted-foreground">
              {ids.length > 0
                ? `${products.length} of ${ids.length} item${ids.length > 1 ? 's' : ''} saved`
                : 'Save items you love for later'}
            </p>
          </div>
        </div>
        {products.length > 0 && (
          <button
            onClick={() => clear()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-4" /> Clear all
          </button>
        )}
      </div>

      {isLoading && <ProductGridSkeleton count={4} className="mt-8" />}

      {!isLoading && products.length === 0 && (
        <EmptyState
          className="mt-12"
          icon={<Heart className="size-10 text-muted-foreground" />}
          title="Your wishlist is empty"
          description="Tap the heart icon on any product to save it here and shop it later."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

      {!isLoading && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-border bg-card p-6">
        <Link
          to="/deals"
          className="flex items-center justify-between text-sm font-semibold text-primary"
        >
          Browse today's deals
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
