import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Sparkles, Users, Headset } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const stats = [
  { value: '10k+', label: 'Happy Customers', icon: Users },
  { value: '24/7', label: 'Premium Support', icon: Headset },
  { value: '100%', label: 'Secure Checkout', icon: ShieldCheck },
  { value: '19k+', label: 'Pin Codes Served', icon: Truck },
];

const values = [
  {
    icon: Sparkles,
    title: 'Curated Quality',
    text: 'Every product in our catalog is carefully selected to meet rigorous standards for quality and design.',
  },
  {
    icon: Truck,
    title: 'Blazing Delivery',
    text: 'A microservices-based platform ensures lightning-fast performance and dependable delivery across India.',
  },
  {
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    text: 'Changed your mind? Enjoy a simple 7-day return and replacement policy on all eligible products.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Security',
    text: 'Encrypted payments, verified sellers, and genuine products backed by manufacturer warranty.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />

      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-card p-10 md:p-14">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Our Story
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-4xl font-bold text-foreground md:text-5xl"
          >
            Redefining Premium E-Commerce
          </motion.h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Welcome to SkylineShop, where quality meets convenience. Founded with a vision to
            provide a curated selection of premium products, we bridge the gap between luxury and
            everyday life.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Our microservices-based platform delivers a fast, reliable and secure shopping
            experience. From smartphones to home essentials, everything is just a few clicks away.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center">
            <s.icon className="mx-auto size-6 text-primary" />
            <p className="mt-3 text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold text-foreground">What We Stand For</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
          The principles that guide every decision we make.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-3xl border border-border bg-card p-10 text-center">
        <h2 className="text-2xl font-bold text-foreground">Ready to explore?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Discover thousands of handpicked products across every category.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          Start Shopping
        </Link>
      </section>
    </div>
  );
}
