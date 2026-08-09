import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Flame, Heart, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { cn } from '@/lib/utils';

const HIDDEN_PATHS = [/^\/checkout/, /^\/order-confirmation/];

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/deals', label: 'Deals', icon: Flame },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + (i.quantity || 0), 0));

  if (HIDDEN_PATHS.some((re) => re.test(pathname))) return null;

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
    >
      <div className="grid h-14 grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const badge = to === '/wishlist' ? wishlistCount : to === '/cart' ? cartCount : 0;
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="relative">
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
