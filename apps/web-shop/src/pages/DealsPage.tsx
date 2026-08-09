import { useMemo, useState } from 'react';
import { Flame } from 'lucide-react';
import { useDeals } from '@/modules/products/hooks/useCatalog';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductGridSkeleton } from '@/components/commerce/ProductCardSkeleton';
import { FlashCountdown } from '@/components/commerce/FlashCountdown';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function DealsPage() {
  const { data, isLoading } = useDeals(24);
  const [range, setRange] = useState<'all' | 'above30' | 'above50'>('all');
  const dealEndsAt = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  }, []);

  const products = (data ?? []).filter((p) =>
    range === 'all'
      ? true
      : range === 'above30'
        ? p.discountPercentage >= 30
        : p.discountPercentage >= 50,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: "Today's Deals" }]} />

      <div className="mt-4 overflow-hidden rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/20 via-card to-card p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-destructive">
              <Flame className="size-6" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Limited Time Offers
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              Today's Best Deals
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Unbeatable prices, handpicked just for you. Grab them before they're gone.
            </p>
          </div>
          <FlashCountdown
            targetTimestamp={dealEndsAt}
            className="rounded-2xl border border-border bg-background/60 px-6 py-4"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(
          [
            { id: 'all', label: 'All Deals' },
            { id: 'above30', label: '30% Off or More' },
            { id: 'above50', label: '50% Off or More' },
          ] as const
        ).map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              range === r.id
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {isLoading && <ProductGridSkeleton count={12} className="mt-8" />}

      {!isLoading && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
