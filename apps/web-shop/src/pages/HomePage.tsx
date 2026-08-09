import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgePercent,
  Flame,
  Sparkles,
  TrendingUp,
  History,
  Gift,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import {
  useBrands,
  useDeals,
  useNewArrivals,
  useRecentlyViewedProducts,
  useRecommended,
  useTrending,
} from '@/modules/products/hooks/useCatalog';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductCardSkeleton } from '@/components/commerce/ProductCardSkeleton';
import { SectionHeader } from '@/components/commerce/SectionHeader';
import { FlashCountdown } from '@/components/commerce/FlashCountdown';
import { Carousel, CarouselSlide } from '@/components/ui/carousel';
import { CATEGORIES } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { toPrice } from '@/lib/utils';

const heroSlides = [
  {
    kicker: 'MEGA SALE · UP TO 50% OFF',
    title: 'Upgrade Your Tech Arsenal',
    highlight: 'Smartphones, Laptops & Audio',
    copy: "Grab the season's hottest gadgets at prices that make sense.",
    cta: { label: 'Shop Electronics', to: '/products?category=smartphones' },
    wash: 'from-sky-100/80 via-sky-50/40 to-transparent',
    accent: 'text-sky-700',
  },
  {
    kicker: 'STYLE WEEK · NEW DROPS',
    title: 'Fashion That Moves With You',
    highlight: 'Footwear, Fashion & Accessories',
    copy: 'Trending styles handpicked for your wardrobe — fresh every week.',
    cta: { label: 'Shop Fashion', to: '/products?category=womens-dresses' },
    wash: 'from-pink-100/80 via-pink-50/40 to-transparent',
    accent: 'text-pink-700',
  },
  {
    kicker: 'HOME & LIVING',
    title: 'Make Home Feel Premium',
    highlight: 'Kitchen, Home & Grocery',
    copy: 'Everything your space deserves, delivered to your door in days.',
    cta: { label: 'Shop Home', to: '/products?category=home-decoration' },
    wash: 'from-emerald-100/80 via-emerald-50/40 to-transparent',
    accent: 'text-emerald-700',
  },
];

function PromoRow() {
  const total = toPrice(999);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { icon: Truck, title: 'Free Delivery', sub: `On orders above ${formatPrice(total)}` },
        { icon: RotateCcw, title: 'Easy Returns', sub: '7-day replacement guarantee' },
        { icon: ShieldCheck, title: 'Secure Payments', sub: 'UPI, cards & COD accepted' },
      ].map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <b.icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{b.title}</p>
            <p className="text-xs text-muted-foreground">{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const deals = useDeals(20);
  const trending = useTrending(20);
  const newArrivals = useNewArrivals(12);
  const brands = useBrands(10);
  const recommended = useRecommended();
  const recentlyViewed = useRecentlyViewedProducts(12);

  const dealEndsAt = (() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  })();

  const renderRow = (
    items: typeof deals.data,
    fallbackCount: number,
    loading: boolean,
    keyPrefix: string,
  ) =>
    loading ? (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: fallbackCount }).map((_, i) => (
          <ProductCardSkeleton key={`${keyPrefix}-s-${i}`} />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {items?.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    );

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-border">
        <Carousel
          opts={{ loop: true }}
          autoplay
          autoplayDelay={6000}
          showDots
          className="mx-auto max-w-7xl px-0 sm:px-4"
        >
          {heroSlides.map((slide, i) => (
            <CarouselSlide key={i} className="px-0">
              <div className="relative min-h-[320px] overflow-hidden bg-background-elevated sm:min-h-[380px]">
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.wash}`} />
                <div className="relative mx-auto flex h-full min-h-[320px] max-w-7xl flex-col justify-center px-5 py-14 sm:min-h-[380px] sm:px-10 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span className="inline-flex items-center rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground">
                      {slide.kicker}
                    </span>
                    <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                      {slide.title}
                      <span className={`mt-2 block ${slide.accent}`}>{slide.highlight}</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
                      {slide.copy}
                    </p>
                    <Link
                      to={slide.cta.to}
                      className="group mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {slide.cta.label}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CarouselSlide>
          ))}
        </Carousel>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        {/* Promo row */}
        <div className="pt-6">
          <PromoRow />
        </div>

        {/* Categories */}
        <section className="mt-10">
          <SectionHeader
            title="Shop by Category"
            subtitle="Explore what's trending across the store"
            icon={<Sparkles className="size-5" />}
            viewAllHref="/categories"
            viewAllLabel="All Categories"
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {CATEGORIES.slice(0, 8).map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.id}
                  to={`/products?category=${encodeURIComponent(c.id)}`}
                  className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40"
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-lg ${c.tint} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Flash Deals */}
        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Flame className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  Flash Deals
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  Limited stock, watch the clock
                </p>
              </div>
              <FlashCountdown targetTimestamp={dealEndsAt} size="sm" className="ml-2" />
            </div>
            <Link
              to="/deals"
              className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
            >
              View All
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {deals.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={`deal-${i}`} />
              ))}
            </div>
          ) : (
            <Carousel
              opts={{ align: 'start', loop: false }}
              showDots={false}
              arrowClassName="top-24"
            >
              {(deals.data ?? []).map((p, i) => (
                <CarouselSlide
                  key={p.id}
                  className="basis-[46%] sm:basis-[30%] lg:basis-[24%] xl:basis-[19.4%]"
                >
                  <ProductCard product={p} index={i} />
                </CarouselSlide>
              ))}
            </Carousel>
          )}
        </section>

        {/* Trending */}
        <section className="mt-14">
          <SectionHeader
            title="Trending Now"
            subtitle="What everyone's buying right now"
            icon={<TrendingUp className="size-5" />}
            viewAllHref="/products?sortBy=rating&sortOrder=desc"
          />
          {renderRow(trending.data, 10, trending.isLoading, 'trending')}
        </section>

        {/* Brand strip */}
        <section className="mt-12 rounded-lg border border-border bg-card p-6">
          <SectionHeader
            title="Shop by Brand"
            className="mb-4"
            viewAllHref="/products"
            viewAllLabel="All Brands"
          />
          <div className="flex flex-wrap gap-2.5">
            {brands.data?.map((b, i) => (
              <Link
                key={i}
                to={`/products?q=${encodeURIComponent(b)}`}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {b}
              </Link>
            ))}
            {brands.isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-accent" />
              ))}
          </div>
        </section>

        {/* Banner */}
        <section className="relative mt-12 overflow-hidden rounded-lg border border-border bg-background-elevated p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                <Gift className="size-3.5" /> Members Only
              </span>
              <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                New Arrivals, Fresh Every Week
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to see what's new. Discover the latest drops across every category.
              </p>
            </div>
            <Link
              to="/products?sortBy=createdAt&sortOrder=desc"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore New Arrivals <BadgePercent className="size-4" />
            </Link>
          </div>
        </section>

        {/* New arrivals */}
        <section className="mt-12">
          <SectionHeader
            title="New Arrivals"
            subtitle="Fresh picks, just landed"
            icon={<BadgePercent className="size-5" />}
            viewAllHref="/products?sortBy=createdAt&sortOrder=desc"
          />
          {renderRow(newArrivals.data, 8, newArrivals.isLoading, 'new')}
        </section>

        {/* Recommended */}
        {recommended.data && recommended.data.length > 0 && (
          <section className="mt-12">
            <SectionHeader
              title="Recommended For You"
              subtitle="Based on your browsing"
              icon={<Sparkles className="size-5" />}
              viewAllHref="/products"
            />
            {renderRow(recommended.data, 8, recommended.isLoading, 'rec')}
          </section>
        )}

        {/* Recently viewed */}
        {recentlyViewed.data && recentlyViewed.data.length > 0 && (
          <section className="mt-12">
            <SectionHeader
              title="Recently Viewed"
              subtitle="Pick up where you left off"
              icon={<History className="size-5" />}
              viewAllHref="/recently-viewed"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {recentlyViewed.data.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="pb-4" />
      </div>
    </div>
  );
}
