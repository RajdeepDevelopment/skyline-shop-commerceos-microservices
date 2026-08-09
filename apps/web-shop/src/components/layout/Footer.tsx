import { Link } from 'react-router-dom';
import {
  AtSign,
  Send,
  Rss,
  Globe,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  MapPin,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import { NAV_CATEGORIES } from '@/lib/categories';

const supportLinks = [
  { label: 'Help Center', href: '/#' },
  { label: 'Track Order', href: '/orders' },
  { label: 'Returns & Refunds', href: '/#' },
  { label: 'Shipping Policy', href: '/#' },
  { label: 'Contact Us', href: '/#' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/#' },
  { label: 'Privacy Policy', href: '/#' },
  { label: 'Terms of Service', href: '/#' },
];

const paymentMethods = ['VISA', 'Mastercard', 'UPI', 'PayPal', 'RuPay', 'COD'];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      {/* Trust badges */}
      <div className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Fast Delivery', sub: 'Across 19,000+ pin codes' },
            { icon: ShieldCheck, title: '100% Genuine', sub: 'Authentic products only' },
            { icon: RotateCcw, title: 'Easy Returns', sub: '7-day replacement policy' },
            { icon: Headset, title: '24/7 Support', sub: 'Dedicated help anytime' },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
              S
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              SKYLINE<span className="text-primary">SHOP</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Experience the future of e-commerce with our premium selection of curated goods.
            Designed for style, built for quality.
          </p>
          <div className="mt-5 flex gap-3">
            {[AtSign, Send, Rss, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            Shop
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/deals" className="hover:text-foreground">
                Today's Deals
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-foreground">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-foreground">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-foreground">
                Wishlist
              </Link>
            </li>
            {NAV_CATEGORIES.slice(0, 2).map((c) => (
              <li key={c.id}>
                <Link
                  to={`/products?category=${encodeURIComponent(c.id)}`}
                  className="hover:text-foreground"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            Support
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" /> Bengaluru, India
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" /> 1800-123-4567
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary" /> help@skyline.shop
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SkylineShop. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <CreditCard className="size-3.5 text-muted-foreground" />
            {paymentMethods.map((m) => (
              <span
                key={m}
                className="rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
