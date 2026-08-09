import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  RefreshCw,
  Zap,
  Check,
  Columns2,
  Share2,
  ChevronDown,
  Package,
  BadgeCheck,
  MessageCircleQuestion,
  ArrowRight,
  Banknote,
} from 'lucide-react';
import { productService } from '@/modules/products/services/product.service';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { useCompareStore } from '@/modules/products/stores/compare.store';
import { useRecentlyViewedStore } from '@/modules/products/stores/recently-viewed.store';
import {
  useSimilar,
  useBundleCandidates,
  useRecentlyViewedProducts,
} from '@/modules/products/hooks/useCatalog';
import { getFaqs, getHighlights, getSpecifications } from '@/lib/product-content';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductReviews } from '@/components/commerce/ProductReviews';
import { ProductImage } from '@/components/commerce/ProductImage';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { SectionHeader } from '@/components/commerce/SectionHeader';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { StarRating } from '@/components/ui/star-rating';
import { TabsRoot, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@/components/ui/accordion';
import { toast } from '@/components/ui/toast';
import { cn, toPrice } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { trackProductView, trackAddToCart, trackWishlist, trackEvent } from '@/lib/analytics';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  badge: BadgeCheck,
  shield: ShieldCheck,
  truck: Truck,
  refresh: RotateCcw,
  check: Check,
  zap: Zap,
  network: Package,
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isWishlisted, toggle } = useWishlistStore();
  const compare = useCompareStore();
  const addRecent = useRecentlyViewedStore((s) => s.track);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean;
    warehouse?: string;
    delivery?: { days: number; expected: string; deliveryDate: string };
  } | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      addRecent(product.id);
      trackProductView(product.id, product.category);
      setActiveImage(0);
      setQuantity(1);
    }
  }, [product, addRecent]);

  const similar = useSimilar(product);
  const bundle = useBundleCandidates(product);
  const recentlyViewed = useRecentlyViewedProducts(8);

  const reviewSummary = useQuery({
    queryKey: ['product', product?.id, 'reviews', 'summary'],
    queryFn: () => productService.getReviewSummary(product!.id),
    enabled: !!product,
  });
  const totalReviews = reviewSummary.data?.totalReviews ?? 0;
  const faqs = useMemo(() => (product ? getFaqs(product) : []), [product]);
  const highlights = useMemo(() => (product ? getHighlights(product) : []), [product]);
  const specs = useMemo(() => (product ? getSpecifications(product) : []), [product]);
  const images = useMemo(() => {
    if (!product) return [];
    const all = product.images?.length
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : [];
    return all.length ? all : [''];
  }, [product]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-accent/60" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-accent/60" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-accent/60" />
            <div className="h-6 w-40 animate-pulse rounded bg-accent/60" />
            <div className="h-12 w-52 animate-pulse rounded bg-accent/60" />
            <div className="h-24 w-full animate-pulse rounded bg-accent/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This product may have been removed or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const price = toPrice(product.price);
  const discount = toPrice(product.discountPercentage);
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const save = price - discountedPrice;
  const wished = isWishlisted(product.id);
  const compared = compare.has(product.id);
  const outOfStock = !product.inStock;

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: `/product/${product.id}` } });
    trackAddToCart(product.id, quantity);
    void addToCart(product.id, quantity);
    toast.success('Added to cart', product.title);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: `/product/${product.id}` } });
    trackAddToCart(product.id, quantity);
    void addToCart(product.id, quantity);
    navigate('/checkout');
  };

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Enter a valid 6-digit pincode');
      setDeliveryChecked(false);
      return;
    }
    if (!product) return;
    setCheckingDelivery(true);
    setDeliveryInfo(null);
    try {
      const result = await productService.checkAvailability(product.sku, pincode, quantity);
      setDeliveryInfo(result);
      setDeliveryChecked(true);
      if (result.available) {
        toast.success(
          'Delivery available',
          `Arriving by ${result.delivery?.expected ?? `in ${result.delivery?.days ?? '2-4'} days`} from ${result.warehouse}`,
        );
      } else {
        toast.error('Not deliverable', 'Sorry, we do not deliver to this pincode');
      }
    } catch {
      setDeliveryChecked(true);
      setDeliveryInfo({ available: false });
      toast.error('Delivery check failed', 'Please try again');
    } finally {
      setCheckingDelivery(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    trackEvent('PRODUCT_SHARE', { productId: product.id, category: product.category });
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          {
            label: product.category,
            to: `/products?category=${encodeURIComponent(product.category)}`,
          },
          { label: product.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-12">
        {/* ===== Gallery ===== */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
            <div className="aspect-square">
              <ProductImage
                src={images[activeImage]}
                alt={product.title}
                category={product.category}
                className="h-full w-full"
              />
            </div>
            {discount > 0 && !outOfStock && (
              <span className="absolute left-4 top-4 rounded-lg bg-destructive px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                {Math.round(discount)}% OFF
              </span>
            )}
            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-sm font-semibold text-white">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                    activeImage === i
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    category={product.category}
                    className="h-full w-full"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Delivery check */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="size-4 text-success" /> Delivery Options
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setDeliveryChecked(false);
                }}
                placeholder="Enter pincode"
                inputMode="numeric"
                className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => void checkDelivery()}
                disabled={checkingDelivery}
                className="h-10 shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {checkingDelivery ? 'Checking…' : 'Check'}
              </button>
            </div>
            {deliveryChecked && (
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {deliveryInfo?.available ? (
                  <>
                    <p className="flex items-center gap-1.5 text-success">
                      <Check className="size-3.5" />
                      {deliveryInfo.delivery?.days === 1
                        ? 'Free delivery by tomorrow'
                        : deliveryInfo.delivery
                          ? `Free delivery by ${new Date(deliveryInfo.delivery.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long' })}`
                          : 'Free delivery available'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Package className="size-3.5" /> Ships from {deliveryInfo.warehouse}
                    </p>
                  </>
                ) : (
                  <p className="flex items-center gap-1.5 text-destructive">
                    <MessageCircleQuestion className="size-3.5" />
                    {deliveryInfo ? 'Not deliverable to this pincode' : 'Checking availability…'}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <RefreshCw className="size-3.5" /> 7-day replacement policy
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" /> Pay on delivery available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Info ===== */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary"
            >
              {product.category}
            </Link>
            {product.brand && (
              <span className="text-sm text-muted-foreground">
                by <span className="font-semibold text-foreground">{product.brand}</span>
              </span>
            )}
            <span className="text-xs text-muted-foreground">· SKU: {product.sku}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl"
          >
            {product.title}
          </motion.h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
              {(product.rating ?? 0).toFixed(1)}
              <StarRating value={product.rating} size="xs" className="[&_svg]:size-3.5" />
            </span>
            <span className="text-sm text-muted-foreground">{totalReviews} ratings</span>
            <a href="#reviews" className="text-sm font-semibold text-primary">
              View reviews
            </a>
          </div>

          {/* Price */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(discountedPrice)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(price)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-lg font-semibold text-success">
                  {Math.round(discount)}% off
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                You save <span className="font-bold text-success">{formatPrice(save)}</span> on this
                purchase
              </p>
            )}
            <div className="mt-3 rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">
              Inclusive of all taxes. Free delivery available.
            </div>
          </div>

          {/* Highlights */}
          <ul className="mt-5 space-y-2.5">
            {highlights.map((h) => {
              const Icon = iconMap[h.icon] ?? Check;
              return (
                <li key={h.text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{h.text}</span>
                </li>
              );
            })}
          </ul>

          {/* Bank offers */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Banknote className="size-4 text-primary" /> Available Offers
            </p>
            <div className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
              <p>
                • Flat <span className="font-semibold text-foreground">10% off</span> on HDFC Bank
                credit cards — code <span className="font-mono text-primary">HDFC10</span>
              </p>
              <p>
                • <span className="font-semibold text-foreground">₹100</span> off on first UPI
                payment
              </p>
              <p>
                • No-cost EMI available on orders above{' '}
                <span className="font-semibold text-foreground">{formatPrice(4999)}</span>
              </p>
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={product.minimumOrderQuantity || 1}
              />
              <span className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-success" /> In stock
                    {product.stockCount > 0 && <span>· {product.stockCount} left</span>}
                  </span>
                ) : (
                  <span className="font-semibold text-destructive">Out of stock</span>
                )}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/10 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="size-5" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="size-5" /> Buy Now
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  trackWishlist(product.id);
                  toggle(product.id);
                  if (!wished) toast.success('Added to wishlist', product.title);
                }}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                  wished
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                    : 'border-border text-muted-foreground hover:border-rose-500/40 hover:text-rose-500',
                )}
              >
                <Heart className={cn('size-4', wished && 'fill-rose-500')} />
                {wished ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
              <button
                onClick={() => {
                  if (compared) {
                    compare.remove(product.id);
                    toast.info('Removed from compare');
                  } else {
                    const ok = compare.add(product.id);
                    if (ok) toast.success('Added to compare', product.title);
                    else toast.error('Compare supports up to 4 products');
                  }
                }}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                  compared
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                    : 'border-border text-muted-foreground hover:border-indigo-500/40 hover:text-indigo-400',
                )}
              >
                <Columns2 className="size-4" />
                {compared ? 'Comparing' : 'Compare'}
              </button>
              <button
                onClick={() => void share()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent"
                aria-label="Share"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Specs mini */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground">Product Specifications</h3>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {specs.slice(0, 6).map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between gap-3 border-b border-border/50 pb-2 text-sm"
                >
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-medium text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="#specs"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              View full specs <ChevronDown className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Tabs: Description / Specs / Reviews / Q&A ===== */}
      <div id="reviews" className="mt-14">
        <TabsRoot defaultValue="reviews">
          <TabsList className="inline-flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 sm:w-auto">
            <TabsTab value="description">Description</TabsTab>
            <TabsTab value="specs">Specifications</TabsTab>
            <TabsTab value="reviews">Reviews ({totalReviews})</TabsTab>
            <TabsTab value="qa">Q&A ({faqs.length})</TabsTab>
          </TabsList>

          <TabsPanel value="description" className="mt-6">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">About this product</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {product.description || 'No description available.'}
              </p>
              {product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {product.warrantyInformation && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="size-4 text-success" /> {product.warrantyInformation}
                </p>
              )}
            </div>
          </TabsPanel>

          <TabsPanel value="specs" className="mt-6">
            <div id="specs" className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Full Specifications</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-medium text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsPanel>

          <TabsPanel value="reviews" className="mt-6">
            <ProductReviews productId={product.id} />
          </TabsPanel>

          <TabsPanel value="qa" className="mt-6">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Customer Questions & Answers</h2>
              </div>
              <AccordionRoot className="mt-4 divide-y divide-border/60">
                {faqs.map((f) => (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionPanel>{f.answer}</AccordionPanel>
                  </AccordionItem>
                ))}
              </AccordionRoot>
            </div>
          </TabsPanel>
        </TabsRoot>
      </div>

      {/* ===== Frequently bought together ===== */}
      {bundle.data && bundle.data.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            title="Frequently Bought Together"
            subtitle="Complete the setup with these picks"
            icon={<Package className="size-5" />}
          />
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[product, ...bundle.data.slice(0, 3)].map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex flex-col items-center rounded-2xl border border-border/60 p-3 text-center transition-colors hover:border-primary/40"
                >
                  <ProductImage
                    src={p.thumbnail || p.images?.[0]}
                    alt={p.title}
                    category={p.category}
                    className="aspect-square w-full rounded-xl"
                  />
                  <span className="mt-2 line-clamp-1 text-xs text-muted-foreground">{p.title}</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(toPrice(p.price) * (1 - p.discountPercentage / 100))}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="text-sm text-muted-foreground">Bundle total</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(
                    [product, ...bundle.data.slice(0, 3)].reduce(
                      (sum, p) => sum + toPrice(p.price) * (1 - p.discountPercentage / 100),
                      0,
                    ),
                  )}
                </p>
                <p className="text-xs text-success">
                  Save{' '}
                  {formatPrice(
                    [product, ...bundle.data.slice(0, 3)].reduce(
                      (sum, p) => sum + (toPrice(p.price) * p.discountPercentage) / 100,
                      0,
                    ),
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isAuthenticated) return navigate('/login');
                  [product, ...bundle.data.slice(0, 3)].forEach((p) => void addToCart(p.id, 1));
                  toast.success('Bundle added to cart');
                }}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <ShoppingCart className="size-4" /> Add All to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== Similar ===== */}
      {similar.data && similar.data.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            title="Similar Products"
            subtitle={`More in ${product.category}`}
            icon={<RefreshCw className="size-5" />}
            viewAllHref={`/products?category=${encodeURIComponent(product.category)}`}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {similar.data.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Recently viewed ===== */}
      {recentlyViewed.data && recentlyViewed.data.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            title="Recently Viewed"
            icon={<ArrowRight className="size-5" />}
            viewAllHref="/recently-viewed"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {recentlyViewed.data.slice(0, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Mobile sticky buy bar ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {formatPrice(discountedPrice)}
            </p>
            {discount > 0 && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(price)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/10 text-sm font-bold text-primary disabled:opacity-50"
          >
            <ShoppingCart className="size-4" /> Add
          </button>
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            <Zap className="size-4" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
