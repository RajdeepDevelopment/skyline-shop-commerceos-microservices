import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Columns2, ShoppingCart, Trash2, X } from 'lucide-react';
import { useCompareStore, MAX_COMPARE } from '@/modules/products/stores/compare.store';
import { productService } from '@/modules/products/services/product.service';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { toast } from '@/components/ui/toast';
import { StarRating } from '@/components/ui/star-rating';
import { EmptyState } from '@/components/commerce/EmptyState';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductImage } from '@/components/commerce/ProductImage';
import { formatPrice } from '@/lib/format';

function discounted(p: { price: number; discountPercentage: number }) {
  return p.price * (1 - p.discountPercentage / 100);
}

export default function ComparePage() {
  const { ids, clear } = useCompareStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'compare', ids],
    queryFn: () => productService.getByIds(ids, MAX_COMPARE),
    enabled: ids.length > 0,
  });

  const products = (data ?? []).filter((p) => ids.includes(p.id));

  const rows = [
    {
      label: 'Price',
      render: (p: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{formatPrice(discounted(p))}</span>
          {p.discountPercentage > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(p.price)}
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Rating',
      render: (p: any) => (
        <div className="flex flex-col items-center gap-1">
          <StarRating value={p.rating} showValue />
        </div>
      ),
    },
    { label: 'Brand', render: (p: any) => p.brand ?? '—' },
    { label: 'Discount', render: (p: any) => `${Math.round(p.discountPercentage)}% off` },
    {
      label: 'In Stock',
      render: (p: any) => (
        <span
          className={p.inStock ? 'font-semibold text-success' : 'font-semibold text-destructive'}
        >
          {p.inStock ? 'Yes' : 'No'}
        </span>
      ),
    },
    { label: 'Category', render: (p: any) => p.category },
    { label: 'Warranty', render: (p: any) => p.warrantyInformation ?? '—' },
    { label: 'Shipping', render: (p: any) => p.shippingInformation ?? '—' },
    { label: 'Return Policy', render: (p: any) => p.returnPolicy ?? '—' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Columns2 className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compare Products</h1>
            <p className="text-sm text-muted-foreground">
              Up to {MAX_COMPARE} products side by side
            </p>
          </div>
        </div>
        {products.length > 1 && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-4" /> Clear comparison
          </button>
        )}
      </div>

      {isLoading && <div className="mt-8 h-64 animate-pulse rounded-2xl bg-accent/60" />}

      {!isLoading && products.length === 0 && (
        <EmptyState
          className="mt-12"
          icon={<Columns2 className="size-10 text-muted-foreground" />}
          title="Nothing to compare yet"
          description="Use the Compare button on product pages to add up to 4 items here."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      )}

      {!isLoading && products.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="w-32 border-b border-border/60 p-4 align-top" />
                {products.map((p) => (
                  <th key={p.id} className="border-b border-border/60 p-4 align-top">
                    <div className="flex justify-end">
                      <button
                        onClick={() => useCompareStore.getState().remove(p.id)}
                        className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <Link to={`/product/${p.id}`} className="group block">
                      <ProductImage
                        src={p.thumbnail || p.images?.[0]}
                        alt={p.title}
                        category={p.category}
                        className="mx-auto h-32 w-32 rounded-xl"
                      />
                      <p className="mt-2 line-clamp-2 font-medium text-foreground group-hover:text-primary">
                        {p.title}
                      </p>
                    </Link>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) return navigate('/login');
                        void addToCart(p.id, 1);
                        toast.success('Added to cart', p.title);
                      }}
                      className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <ShoppingCart className="size-4" /> Add to Cart
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/40 last:border-0">
                  <td className="p-4 text-left font-semibold text-muted-foreground">{row.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 text-foreground">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
