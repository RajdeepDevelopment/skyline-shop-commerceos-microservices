import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, ChevronRight, Tag } from 'lucide-react';
import { productService } from '@/modules/products/services/product.service';
import { CATEGORIES, getCategoryById } from '@/lib/categories';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

function titleCase(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoriesPage() {
  const { data: backendCategories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const all = Array.from(new Set([...CATEGORIES.map((c) => c.id), ...(backendCategories ?? [])]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutGrid className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse Categories</h1>
          <p className="text-sm text-muted-foreground">Explore the full range of what we offer</p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {!isLoading &&
          all.map((cat) => {
            const def = getCategoryById(cat);
            const Icon = def?.icon ?? Tag;
            return (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${def?.gradient ?? 'from-primary/25 to-primary/5'} text-primary transition-transform group-hover:scale-110`}
                >
                  <Icon className="size-7" />
                </span>
                <div>
                  <p className="font-bold text-foreground">{def?.label ?? titleCase(cat)}</p>
                  {def?.tagline && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{def.tagline}</p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Shop now <ChevronRight className="size-3" />
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
