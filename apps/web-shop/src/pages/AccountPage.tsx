import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  History,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Truck,
  Plus,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useWishlistStore } from '@/modules/wishlist/stores/wishlist.store';
import { useCartStore } from '@/modules/cart/stores/cart.store';
import { useRecentlyViewedStore } from '@/modules/products/stores/recently-viewed.store';
import { orderService } from '@/modules/orders/services/order.service';
import {
  SavedAddress,
  SavedCard,
  getSavedAddresses,
  upsertSavedAddress,
  removeSavedAddress,
  getSavedCards,
  addSavedCard,
  removeSavedCard,
} from '@/lib/account-data';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Button from '@/common/ui/button';
import { Input } from '@/components/ui/input';
import { DialogRoot, DialogContent, DialogTitle } from '@/components/ui/dialog';

type AddressDraft = Omit<SavedAddress, 'id'>;

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { items } = useCartStore();
  const recentIds = useRecentlyViewedStore((s) => s.ids);

  const userId = user?.id ?? '';
  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    userId ? getSavedAddresses(userId) : [],
  );
  const [cards, setCards] = useState<SavedCard[]>(() => (userId ? getSavedCards(userId) : []));
  const [addressDraft, setAddressDraft] = useState<SavedAddress | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [cardDraft, setCardDraft] = useState<SavedCard | null>(null);
  const [cardOpen, setCardOpen] = useState(false);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['account', 'orders', userId],
    queryFn: () => orderService.getOrders(),
    enabled: !!userId,
  });

  const stats = useMemo(
    () => [
      {
        icon: Package,
        label: 'Orders',
        value: ordersLoading ? '…' : String(orders?.length ?? 0),
        href: '/orders',
        color: 'text-primary bg-primary/10',
      },
      {
        icon: Heart,
        label: 'Wishlist',
        value: String(wishlistCount),
        href: '/wishlist',
        color: 'text-rose-500 bg-rose-500/10',
      },
      {
        icon: Truck,
        label: 'Cart Items',
        value: String(items.reduce((n, i) => n + (i.quantity || 0), 0)),
        href: '/cart',
        color: 'text-success bg-success/10',
      },
      {
        icon: History,
        label: 'Recently Viewed',
        value: String(recentIds.length),
        href: '/recently-viewed',
        color: 'text-indigo-400 bg-indigo-500/10',
      },
    ],
    [orders, ordersLoading, wishlistCount, items, recentIds.length],
  );

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your account…</p>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const submitAddress = (draft: AddressDraft, id?: string) => {
    const next = upsertSavedAddress(userId, { ...draft, id: id ?? crypto.randomUUID() });
    setAddresses(next);
    setAddressOpen(false);
    setAddressDraft(null);
  };

  const removeAddress = (id: string) => setAddresses(removeSavedAddress(userId, id));

  const submitCard = (draft: Omit<SavedCard, 'id'>) => {
    const next = addSavedCard(userId, { ...draft, id: crypto.randomUUID() });
    setCards(next);
    setCardOpen(false);
    setCardDraft(null);
  };

  const removeCard = (id: string) => setCards(removeSavedCard(userId, id));

  const openAddAddress = () => {
    setAddressDraft(null);
    setAddressOpen(true);
  };
  const openEditAddress = (a: SavedAddress) => {
    setAddressDraft(a);
    setAddressOpen(true);
  };
  const openAddCard = () => {
    setCardDraft(null);
    setCardOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />

      {/* Profile header */}
      <div className="mt-4 flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-card to-card p-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
        </div>
        <Button
          variant="outline"
          onClick={() => void logout()}
          className="text-destructive hover:border-destructive/40 hover:bg-destructive/10"
        >
          <LogOut className="size-4" /> Logout
        </Button>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <span className={`flex size-11 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Addresses + Cards */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <MapPin className="size-5 text-primary" /> Saved Addresses
            </h2>
            <Button variant="outline" size="sm" onClick={openAddAddress}>
              <Plus className="size-4" /> Add Address
            </Button>
          </div>
          {addresses.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
              No saved addresses yet. Add one to speed up checkout.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {a.label}
                    </span>
                    <div className="flex gap-3 text-xs font-medium text-muted-foreground">
                      <button className="hover:text-primary" onClick={() => openEditAddress(a)}>
                        Edit
                      </button>
                      <button
                        className="hover:text-destructive"
                        onClick={() => removeAddress(a.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.line}</p>
                  <p className="text-sm text-muted-foreground">{a.city}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.phone}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <CreditCard className="size-5 text-primary" /> Saved Payment Methods
            </h2>
            <Button variant="outline" size="sm" onClick={openAddCard}>
              <Plus className="size-4" /> Add Card
            </Button>
          </div>
          {cards.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
              No saved cards. Add one for faster checkout (details stay on this device).
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-card/60 p-5"
                >
                  <div className="absolute -right-6 -top-8 size-24 rounded-full bg-primary/10" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-black/80 px-2 py-1 text-[10px] font-bold tracking-wider text-white">
                        {c.brand}
                      </span>
                      <ShieldCheck className="size-4 text-success" />
                    </div>
                    <p className="mt-4 font-mono text-lg tracking-widest text-foreground">
                      •••• •••• •••• {c.last4}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{c.name}</span>
                      <span>Expires {c.expires}</span>
                    </div>
                    <button
                      className="absolute bottom-5 right-5 text-xs font-medium text-muted-foreground hover:text-destructive"
                      onClick={() => removeCard(c.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar links */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-3">
          {[
            { icon: User, label: 'Profile Details', href: '/account' },
            { icon: Package, label: 'My Orders', href: '/orders' },
            { icon: Heart, label: 'Wishlist', href: '/wishlist' },
            { icon: History, label: 'Recently Viewed', href: '/recently-viewed' },
            { icon: MapPin, label: 'Manage Addresses', href: '/account' },
            { icon: CreditCard, label: 'Payment Methods', href: '/account' },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-3">
                <l.icon className="size-4 text-muted-foreground" /> {l.label}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </aside>
      </div>

      {/* Address dialog */}
      <DialogRoot open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent>
          <DialogTitle>{addressDraft ? 'Edit Address' : 'Add Address'}</DialogTitle>
          <AddressForm
            initial={addressDraft}
            onSubmit={(draft) => submitAddress(draft, addressDraft?.id)}
          />
        </DialogContent>
      </DialogRoot>

      {/* Card dialog */}
      <DialogRoot open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent>
          <DialogTitle>Add Card</DialogTitle>
          <CardForm initial={cardDraft} onSubmit={submitCard} />
        </DialogContent>
      </DialogRoot>
    </div>
  );
}

function AddressForm({
  initial,
  onSubmit,
}: {
  initial: SavedAddress | null;
  onSubmit: (draft: AddressDraft) => void;
}) {
  const [form, setForm] = useState<AddressDraft>({
    label: initial?.label ?? 'Home',
    name: initial?.name ?? '',
    line: initial?.line ?? '',
    city: initial?.city ?? '',
    phone: initial?.phone ?? '',
  });

  const set = (key: keyof AddressDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.line.trim() || !form.city.trim()) return;
        onSubmit(form);
      }}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Label</label>
        <Input value={form.label} onChange={set('label')} placeholder="Home / Work" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
        <Input value={form.name} onChange={set('name')} placeholder="Your full name" required />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
        <Input
          value={form.line}
          onChange={set('line')}
          placeholder="House no, street, locality"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
        <Input value={form.city} onChange={set('city')} placeholder="City, State - PIN" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
        <Input
          value={form.phone}
          onChange={set('phone')}
          placeholder="10-digit mobile"
          inputMode="numeric"
        />
      </div>
      <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
        <Button type="submit">{initial ? 'Save Changes' : 'Add Address'}</Button>
      </div>
    </form>
  );
}

function CardForm({
  initial,
  onSubmit,
}: {
  initial: SavedCard | null;
  onSubmit: (draft: Omit<SavedCard, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<SavedCard, 'id'>>({
    brand: initial?.brand ?? 'VISA',
    last4: initial?.last4 ?? '',
    expires: initial?.expires ?? '',
    name: initial?.name ?? '',
  });

  const set = (key: keyof Omit<SavedCard, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (form.last4.length !== 4 || !form.expires.trim()) return;
        onSubmit(form);
      }}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Brand</label>
        <Input value={form.brand} onChange={set('brand')} placeholder="VISA / MASTERCARD" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Last 4 Digits</label>
        <Input
          value={form.last4}
          onChange={set('last4')}
          placeholder="4821"
          inputMode="numeric"
          maxLength={4}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Expiry</label>
        <Input value={form.expires} onChange={set('expires')} placeholder="09/28" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Name on Card</label>
        <Input value={form.name} onChange={set('name')} placeholder="Cardholder name" />
      </div>
      <div className="mt-2 flex justify-end sm:col-span-2">
        <Button type="submit">
          <Plus className="size-4" /> Add Card
        </Button>
      </div>
    </form>
  );
}
