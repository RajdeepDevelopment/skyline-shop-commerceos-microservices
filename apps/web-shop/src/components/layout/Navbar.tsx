import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Package,
  ChevronDown,
  Flame,
  LayoutGrid,
  CircleUser,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { SearchBar } from '@/components/commerce/SearchBar';
import { NAV_CATEGORIES } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { SheetRoot, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';

const accountLinks = [
  { label: 'My Account', href: '/account', icon: CircleUser },
  { label: 'My Orders', href: '/orders', icon: Package },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
];

export default function Navbar() {
  const { items, fetchCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  useEffect(() => {
    if (isAuthenticated) void fetchCart();
  }, [fetchCart, isAuthenticated]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node))
        setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const firstName = user?.firstName || user?.lastName || 'Guest';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      {/* Announcement */}
      <div className="hidden border-b border-border bg-background-elevated md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-1.5 text-[11px] font-medium text-muted-foreground">
          <span>Free delivery on orders above ₹999</span>
          <span className="text-muted-foreground/40">•</span>
          <span>7-day easy returns</span>
          <span className="text-muted-foreground/40">•</span>
          <span>100% genuine products</span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-3 sm:gap-5">
          {/* Mobile menu */}
          <SheetRoot open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <button
                  className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="size-6" />
                </button>
              }
            />
            <SheetContent side="left">
              <SheetTitle className="px-5 pt-6 text-left text-primary">
                SKYLINE<span className="text-muted-foreground">SHOP</span>
              </SheetTitle>
              <div className="mt-2 flex-1 overflow-y-auto px-3 pb-8">
                <div className="px-2 pb-2">
                  <SearchBar onSelect={() => setMenuOpen(false)} />
                </div>
                <nav className="flex flex-col gap-1">
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <LayoutGrid className="size-4 text-primary" /> Home
                  </Link>
                  <Link
                    to="/deals"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <Flame className="size-4 text-destructive" /> Today's Deals
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <Heart className="size-4 text-rose-500" /> Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                  >
                    <Package className="size-4 text-primary" /> Orders
                  </Link>
                </nav>
                <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Shop by Category
                </p>
                <nav className="flex flex-col gap-1">
                  {NAV_CATEGORIES.map((c) => (
                    <Link
                      key={c.id}
                      to={`/products?category=${encodeURIComponent(c.id)}`}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {c.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-4 border-t border-border pt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2 px-3">
                      <span className="text-sm font-semibold">Hi, {firstName} 👋</span>
                      <button
                        onClick={() => {
                          void logout();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-sm text-destructive"
                      >
                        <LogOut className="size-4" /> Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 text-sm font-semibold text-primary"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </SheetRoot>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              S
            </span>
            <span className="hidden text-xl font-bold tracking-tight text-foreground sm:block">
              SKYLINE<span className="text-primary">SHOP</span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="mx-auto hidden w-full max-w-xl md:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
            <Link
              to="/wishlist"
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                      accountOpen && 'bg-accent text-foreground',
                    )}
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <User className="size-4" />
                    </span>
                    <span className="hidden xl:block">Hi, {firstName}</span>
                    <ChevronDown className="hidden size-3.5 xl:block" />
                  </button>
                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1.5 shadow-lg"
                      >
                        {accountLinks.map((l) => (
                          <Link
                            key={l.href}
                            to={l.href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                          >
                            <l.icon className="size-4 text-muted-foreground" /> {l.label}
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            void logout();
                            setAccountOpen(false);
                            navigate('/');
                          }}
                          className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-border px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <LogOut className="size-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent md:flex"
                >
                  <User className="size-5 text-primary" /> Login
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Category strip (desktop) */}
        <nav className="hidden items-center gap-1 pb-2 md:flex" aria-label="Categories">
          <Link
            to="/products"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <LayoutGrid className="size-4 text-primary" /> All Categories
          </Link>
          <Link
            to="/deals"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <Flame className="size-4" /> Deals
          </Link>
          {NAV_CATEGORIES.slice(0, 7).map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${encodeURIComponent(c.id)}`}
              className="rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <SearchBar size="md" />
        </div>
      </div>

      {/* Mobile menu button fallback (hidden on lg+) */}
      <button className="hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
    </header>
  );
}
