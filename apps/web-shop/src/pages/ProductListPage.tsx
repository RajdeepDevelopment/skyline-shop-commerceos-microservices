import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  Check,
  ChevronDown,
  SearchX,
} from 'lucide-react';
import { productService } from '@/modules/products/services/product.service';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductCardSkeleton } from '@/components/commerce/ProductCardSkeleton';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Pagination } from '@/components/ui/pagination';
import { RangeSlider } from '@/components/ui/slider';
import { SheetRoot, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { CheckboxItem } from '@/components/ui/checkbox';
import { getCategoryById } from '@/lib/categories';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Customer Rating' },
  { value: 'discount-desc', label: 'Discount' },
  { value: 'newest', label: 'Newest First' },
];

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹50,000', min: 15000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: 500000 },
];

const RATING_FILTERS = [4, 3, 2];

const PAGE_SIZE = 12;

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sortParam = searchParams.get('sort') ?? 'relevance';
  const activeMin = Number(searchParams.get('minPrice')) || 0;
  const activeMax = Number(searchParams.get('maxPrice')) || 0;
  const ratingFilter = Number(searchParams.get('rating')) || 0;
  const inStockOnly = searchParams.get('instock') === '1';

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const { sortBy, sortOrder } = useMemo(() => {
    switch (sortParam) {
      case 'price-asc':
        return { sortBy: 'price', sortOrder: 'asc' };
      case 'price-desc':
        return { sortBy: 'price', sortOrder: 'desc' };
      case 'rating-desc':
        return { sortBy: 'rating', sortOrder: 'desc' };
      case 'discount-desc':
        return { sortBy: 'discount', sortOrder: 'desc' };
      case 'newest':
        return { sortBy: 'createdAt', sortOrder: 'desc' };
      default:
        return { sortBy: undefined, sortOrder: undefined };
    }
  }, [sortParam]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'products',
      'list',
      q,
      category,
      page,
      sortParam,
      activeMin,
      activeMax,
      ratingFilter,
      inStockOnly,
    ],
    queryFn: () =>
      productService.getProducts({
        page,
        limit: PAGE_SIZE,
        search: q || undefined,
        category: category || undefined,
        minPrice: activeMin || undefined,
        maxPrice: activeMax || undefined,
        minRating: ratingFilter || undefined,
        inStock: inStockOnly || undefined,
        sortBy: sortBy as 'price' | 'createdAt' | 'rating' | 'discount' | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    const isPageChange = 'page' in patch;
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '' || v === '0') next.delete(k);
      else next.set(k, v);
    });
    if (!isPageChange) next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const setSort = (value: string) => {
    updateParams({ sort: value });
    setSortOpen(false);
  };

  const setPriceRange = (min: number, max: number) => {
    updateParams({ minPrice: min ? String(min) : null, maxPrice: max ? String(max) : null });
  };

  const activeFilterCount =
    (category ? 1 : 0) +
    (activeMin || activeMax ? 1 : 0) +
    (ratingFilter ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    setSearchParams(next, { replace: true });
  };

  const categoryDef = category ? getCategoryById(category) : undefined;
  const totalResults = data?.total ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const activeFilters = [
    ...(categoryDef ? [{ key: 'category', label: categoryDef.label }] : []),
    ...(activeMin || activeMax
      ? [
          {
            key: 'price',
            label: `₹${(activeMin || 0).toLocaleString('en-IN')} – ₹${
              activeMax ? activeMax.toLocaleString('en-IN') : '50,000+'
            }`,
          },
        ]
      : []),
    ...(ratingFilter ? [{ key: 'rating', label: `${ratingFilter}★ & up` }] : []),
    ...(inStockOnly ? [{ key: 'instock', label: 'In Stock' }] : []),
  ];

  const removeFilter = (key: string) => {
    switch (key) {
      case 'category':
        updateParams({ category: null });
        break;
      case 'price':
        updateParams({ minPrice: null, maxPrice: null });
        break;
      case 'rating':
        updateParams({ rating: null });
        break;
      case 'instock':
        updateParams({ instock: null });
        break;
    }
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortParam)?.label ?? 'Relevance';

  const FilterSidebar = (
    <div className="flex flex-col gap-6">
      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">Price</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const active = activeMin === r.min && activeMax === r.max;
            return (
              <button
                key={r.label}
                onClick={() => setPriceRange(active ? 0 : r.min, active ? 0 : r.max)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <CheckboxItem
                  checked={active}
                  onCheckedChange={() => setPriceRange(active ? 0 : r.min, active ? 0 : r.max)}
                />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 px-1">
          <RangeSlider
            min={0}
            max={100000}
            step={1000}
            value={[activeMin, activeMax || 100000]}
            onValueChange={([min, max]) =>
              updateParams({
                minPrice: min ? String(min) : null,
                maxPrice: max === 100000 ? null : String(max),
              })
            }
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{activeMin ? `₹${activeMin.toLocaleString('en-IN')}` : '₹0'}</span>
            <span>
              {activeMax
                ? `₹${activeMax.toLocaleString('en-IN')}`
                : `₹${(100000).toLocaleString('en-IN')}+`}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">Customer Ratings</h3>
        <div className="space-y-1">
          {RATING_FILTERS.map((r) => {
            const active = ratingFilter === r;
            return (
              <button
                key={r}
                onClick={() => updateParams({ rating: active ? null : String(r) })}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <CheckboxItem
                  checked={active}
                  onCheckedChange={() => updateParams({ rating: active ? null : String(r) })}
                />
                <span className="text-amber-400">{'★'.repeat(r)}</span>
                <span className="text-muted-foreground">& up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">Availability</h3>
        <button
          onClick={() => updateParams({ instock: inStockOnly ? null : '1' })}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
            inStockOnly
              ? 'bg-primary/10 font-semibold text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          <CheckboxItem
            checked={inStockOnly}
            onCheckedChange={() => updateParams({ instock: inStockOnly ? null : '1' })}
          />
          In Stock Only
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          ...(categoryDef
            ? [{ label: categoryDef.label }]
            : q
              ? [{ label: `Search: "${q}"` }]
              : [{ label: 'All Products' }]),
        ]}
      />

      {/* Title */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {categoryDef ? categoryDef.label : q ? `Results for "${q}"` : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${totalResults} item${totalResults === 1 ? '' : 's'}`}
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline"
          >
            <X className="size-4" /> Clear all filters
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1.5 text-xs font-medium text-foreground"
            >
              {f.label}
              <button
                onClick={() => removeFilter(f.key)}
                aria-label={`Remove filter ${f.label}`}
                className="flex size-4 items-center justify-center rounded-full bg-accent text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-lg border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <SlidersHorizontal className="size-4 text-primary" /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {FilterSidebar}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="-mx-4 sticky top-[116px] z-30 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 lg:static lg:mx-0 lg:mb-4 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <SheetRoot open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger
                  render={
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground lg:hidden">
                      <SlidersHorizontal className="size-4 text-primary" /> Filters
                      {activeFilterCount > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  }
                />
                <SheetContent side="right" className="w-[320px] sm:w-[360px]">
                  <SheetTitle className="flex items-center gap-2 px-1 pb-4 text-base">
                    <SlidersHorizontal className="size-4 text-primary" /> Filters
                  </SheetTitle>
                  <div className="flex-1 overflow-y-auto px-1">{FilterSidebar}</div>
                  <div className="mt-4 flex gap-3 border-t border-border pt-4">
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setFiltersOpen(false);
                      }}
                      className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Apply
                    </button>
                  </div>
                </SheetContent>
              </SheetRoot>

              {/* Sort */}
              <SheetRoot open={sortOpen} onOpenChange={setSortOpen}>
                <SheetTrigger
                  render={
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground">
                      <ArrowUpDown className="size-4 text-primary" />{' '}
                      <span className="hidden sm:inline">Sort by:</span> {currentSortLabel}
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </button>
                  }
                />
                <SheetContent side="bottom" className="max-h-[70vh]">
                  <SheetTitle className="px-1 pb-2 text-base">Sort By</SheetTitle>
                  <div className="flex flex-col gap-1 overflow-y-auto px-1 pb-4">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setSort(o.value)}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors',
                          sortParam === o.value
                            ? 'bg-primary/10 font-semibold text-primary'
                            : 'text-foreground hover:bg-accent',
                        )}
                      >
                        {o.label}
                        {sortParam === o.value && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </SheetRoot>
            </div>

            {/* Layout toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setLayout('grid')}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  layout === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  layout === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>

          {/* Results */}
          {isLoading && !data ? (
            <div
              className={
                layout === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'
                  : 'grid grid-cols-1 gap-4'
              }
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} layout={layout} />
              ))}
            </div>
          ) : data && data.products.length === 0 ? (
            <EmptyState
              className="rounded-lg border border-border bg-card py-16"
              icon={<SearchX className="size-10 text-muted-foreground" />}
              title="No products found"
              description="Try adjusting your filters or search for something else."
              actionLabel={activeFilterCount > 0 ? 'Clear Filters' : 'Browse All'}
              onAction={activeFilterCount > 0 ? clearAllFilters : undefined}
              actionHref={activeFilterCount > 0 ? undefined : '/products'}
            />
          ) : (
            <>
              <div
                className={cn(
                  'grid gap-3 sm:gap-4',
                  layout === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1',
                )}
              >
                {data?.products.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    layout={layout}
                    className={layout === 'list' ? 'mb-0' : ''}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  className="mt-8"
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParams({ page: p > 1 ? String(p) : null })}
                />
              )}
            </>
          )}

          {isFetching && data && (
            <div
              className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 animate-pulse bg-primary"
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}
