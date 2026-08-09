import * as React from 'react';
import {
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Home as HomeIcon,
  Sparkles,
  ShoppingBasket,
  Dumbbell,
  Car,
  Watch,
  Headphones,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function categoryKey(category: string | null | undefined): string {
  const c = (category || '').toLowerCase();
  if (c.includes('phone') || c.includes('mobile') || c.includes('smartphone')) return 'mobiles';
  if (c.includes('laptop') || c.includes('computer') || c.includes('desktop')) return 'laptops';
  if (
    c.includes('fashion') ||
    c.includes('clothing') ||
    c.includes('apparel') ||
    c.includes('shirt') ||
    c.includes('dress')
  )
    return 'fashion';
  if (c.includes('shoe') || c.includes('footwear') || c.includes('sneaker')) return 'shoes';
  if (c.includes('home') || c.includes('furniture') || c.includes('kitchen')) return 'home';
  if (
    c.includes('beauty') ||
    c.includes('fragrance') ||
    c.includes('skincare') ||
    c.includes('cosmetic')
  )
    return 'beauty';
  if (c.includes('grocer') || c.includes('food') || c.includes('snack')) return 'grocery';
  if (c.includes('sport') || c.includes('fitness') || c.includes('gym')) return 'sports';
  if (c.includes('auto') || c.includes('car') || c.includes('vehicle')) return 'automotive';
  if (c.includes('accessor') || c.includes('watch') || c.includes('jewel')) return 'accessories';
  if (
    c.includes('audio') ||
    c.includes('headphone') ||
    c.includes('earbud') ||
    c.includes('speaker')
  )
    return 'audio';
  return 'default';
}

const ICONS: Record<string, React.ReactNode> = {
  mobiles: <Smartphone className="size-10" />,
  laptops: <Laptop className="size-10" />,
  fashion: <Shirt className="size-10" />,
  shoes: <Footprints className="size-10" />,
  home: <HomeIcon className="size-10" />,
  beauty: <Sparkles className="size-10" />,
  grocery: <ShoppingBasket className="size-10" />,
  sports: <Dumbbell className="size-10" />,
  automotive: <Car className="size-10" />,
  accessories: <Watch className="size-10" />,
  audio: <Headphones className="size-10" />,
  default: <Package className="size-10" />,
};

const GRADIENTS: Record<string, string> = {
  mobiles: 'from-sky-500/20 via-blue-500/10 to-transparent',
  laptops: 'from-indigo-500/20 via-blue-500/10 to-transparent',
  fashion: 'from-pink-500/20 via-rose-500/10 to-transparent',
  shoes: 'from-orange-500/20 via-amber-500/10 to-transparent',
  home: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  beauty: 'from-fuchsia-500/20 via-purple-500/10 to-transparent',
  grocery: 'from-lime-500/20 via-green-500/10 to-transparent',
  sports: 'from-red-500/20 via-orange-500/10 to-transparent',
  automotive: 'from-slate-500/20 via-slate-400/10 to-transparent',
  accessories: 'from-cyan-500/20 via-sky-500/10 to-transparent',
  audio: 'from-violet-500/20 via-purple-500/10 to-transparent',
  default: 'from-slate-500/20 via-slate-400/10 to-transparent',
};

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}

export function ProductImage({
  src,
  alt,
  category,
  className,
  imgClassName,
  sizes = '400px',
}: ProductImageProps) {
  const [errored, setErrored] = React.useState(false);
  const key = categoryKey(category);
  const showFallback = !src || errored;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        GRADIENTS[key],
        className,
      )}
    >
      {showFallback ? (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
          {ICONS[key]}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes={sizes}
          onError={() => setErrored(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      )}
    </div>
  );
}
