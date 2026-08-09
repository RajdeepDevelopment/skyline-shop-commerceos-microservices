import { History } from 'lucide-react';
import { useRecentlyViewedProducts } from '@/modules/products/hooks/useCatalog';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductGridSkeleton } from '@/components/commerce/ProductCardSkeleton';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function RecentlyViewedPage() {
  const { data: products, isLoading } = useRecentlyViewedProducts(50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Recently Viewed' }]} />

      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <History className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
          <p className="text-sm text-muted-foreground">Pick up right where you left off</p>
        </div>
      </div>

      {isLoading && <ProductGridSkeleton count={6} className="mt-8" />}

      {!isLoading && (products ?? []).length === 0 && (
        <EmptyState
          className="mt-12"
          icon={<History className="size-10 text-muted-foreground" />}
          title="Nothing here yet"
          description="Products you visit will show up here so you can easily find your way back."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      )}

      {!isLoading && (products ?? []).length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {(products ?? []).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
