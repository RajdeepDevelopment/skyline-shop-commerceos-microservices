import type { LucideIcon } from 'lucide-react';
import {
  Smartphone,
  Laptop,
  Tablet,
  Footprints,
  Home as HomeIcon,
  Sparkles,
  ShoppingBasket,
  Dumbbell,
  Watch,
  Shirt,
  Car,
  Package,
  Gem,
  Sun,
  Flower2,
  Sofa,
  CookingPot,
  ShoppingBag,
} from 'lucide-react';

export interface CategoryDef {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  tint: string;
  tagline: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'smartphones',
    label: 'Mobiles',
    icon: Smartphone,
    gradient: 'from-sky-500/25 to-blue-600/5',
    tint: 'bg-sky-100 text-sky-700',
    tagline: 'Latest phones & more',
  },
  {
    id: 'laptops',
    label: 'Laptops',
    icon: Laptop,
    gradient: 'from-indigo-500/25 to-blue-600/5',
    tint: 'bg-indigo-100 text-indigo-700',
    tagline: 'Work & play',
  },
  {
    id: 'tablets',
    label: 'Tablets',
    icon: Tablet,
    gradient: 'from-blue-500/25 to-indigo-600/5',
    tint: 'bg-blue-100 text-blue-700',
    tagline: 'Big screens, small pockets',
  },
  {
    id: 'mens-shoes',
    label: "Men's Shoes",
    icon: Footprints,
    gradient: 'from-orange-500/25 to-amber-600/5',
    tint: 'bg-orange-100 text-orange-700',
    tagline: 'Step up your style',
  },
  {
    id: 'womens-shoes',
    label: "Women's Shoes",
    icon: Footprints,
    gradient: 'from-pink-500/25 to-rose-600/5',
    tint: 'bg-pink-100 text-pink-700',
    tagline: 'Walk in confidence',
  },
  {
    id: 'mens-shirts',
    label: "Men's Shirts",
    icon: Shirt,
    gradient: 'from-cyan-500/25 to-sky-600/5',
    tint: 'bg-cyan-100 text-cyan-700',
    tagline: 'Sharp every day',
  },
  {
    id: 'tops',
    label: 'Tops & Tees',
    icon: Shirt,
    gradient: 'from-violet-500/25 to-purple-600/5',
    tint: 'bg-violet-100 text-violet-700',
    tagline: 'Casual comfort',
  },
  {
    id: 'womens-dresses',
    label: "Women's Dresses",
    icon: Shirt,
    gradient: 'from-fuchsia-500/25 to-purple-600/5',
    tint: 'bg-fuchsia-100 text-fuchsia-700',
    tagline: 'Trending styles',
  },
  {
    id: 'womens-bags',
    label: 'Handbags',
    icon: ShoppingBag,
    gradient: 'from-amber-500/25 to-yellow-600/5',
    tint: 'bg-amber-100 text-amber-700',
    tagline: 'Carry it all',
  },
  {
    id: 'womens-jewellery',
    label: 'Jewellery',
    icon: Gem,
    gradient: 'from-emerald-500/25 to-teal-600/5',
    tint: 'bg-emerald-100 text-emerald-700',
    tagline: 'Sparkle & shine',
  },
  {
    id: 'mens-watches',
    label: "Men's Watches",
    icon: Watch,
    gradient: 'from-slate-500/25 to-gray-600/5',
    tint: 'bg-slate-200 text-slate-700',
    tagline: 'Timeless pieces',
  },
  {
    id: 'womens-watches',
    label: "Women's Watches",
    icon: Watch,
    gradient: 'from-rose-500/25 to-pink-600/5',
    tint: 'bg-rose-100 text-rose-700',
    tagline: 'Elegant timekeeping',
  },
  {
    id: 'sunglasses',
    label: 'Sunglasses',
    icon: Sun,
    gradient: 'from-yellow-500/25 to-orange-600/5',
    tint: 'bg-yellow-100 text-yellow-700',
    tagline: 'Cool shades',
  },
  {
    id: 'beauty',
    label: 'Beauty',
    icon: Sparkles,
    gradient: 'from-fuchsia-500/25 to-purple-600/5',
    tint: 'bg-fuchsia-100 text-fuchsia-700',
    tagline: 'Glow up',
  },
  {
    id: 'skin-care',
    label: 'Skin Care',
    icon: Flower2,
    gradient: 'from-teal-500/25 to-emerald-600/5',
    tint: 'bg-teal-100 text-teal-700',
    tagline: 'Daily rituals',
  },
  {
    id: 'fragrances',
    label: 'Fragrances',
    icon: Flower2,
    gradient: 'from-purple-500/25 to-fuchsia-600/5',
    tint: 'bg-purple-100 text-purple-700',
    tagline: 'Signature scents',
  },
  {
    id: 'groceries',
    label: 'Grocery',
    icon: ShoppingBasket,
    gradient: 'from-lime-500/25 to-green-600/5',
    tint: 'bg-lime-100 text-lime-700',
    tagline: 'Daily essentials',
  },
  {
    id: 'home-decoration',
    label: 'Home Decor',
    icon: HomeIcon,
    gradient: 'from-emerald-500/25 to-teal-600/5',
    tint: 'bg-emerald-100 text-emerald-700',
    tagline: 'Living essentials',
  },
  {
    id: 'furniture',
    label: 'Furniture',
    icon: Sofa,
    gradient: 'from-amber-500/25 to-orange-600/5',
    tint: 'bg-amber-100 text-amber-700',
    tagline: 'Comfort your space',
  },
  {
    id: 'kitchen-accessories',
    label: 'Kitchen',
    icon: CookingPot,
    gradient: 'from-teal-500/25 to-emerald-600/5',
    tint: 'bg-teal-100 text-teal-700',
    tagline: 'Cook in style',
  },
  {
    id: 'sports-accessories',
    label: 'Sports & Fitness',
    icon: Dumbbell,
    gradient: 'from-red-500/25 to-orange-600/5',
    tint: 'bg-red-100 text-red-700',
    tagline: 'Train harder',
  },
  {
    id: 'vehicle',
    label: 'Vehicles',
    icon: Car,
    gradient: 'from-slate-500/25 to-slate-700/5',
    tint: 'bg-slate-200 text-slate-700',
    tagline: 'Drive & ride',
  },
  {
    id: 'motorcycle',
    label: 'Motorcycles',
    icon: Car,
    gradient: 'from-gray-500/25 to-black/5',
    tint: 'bg-gray-200 text-gray-700',
    tagline: 'Two-wheel thrills',
  },
  {
    id: 'mobile-accessories',
    label: 'Mobile Accessories',
    icon: Package,
    gradient: 'from-cyan-500/25 to-sky-600/5',
    tint: 'bg-cyan-100 text-cyan-700',
    tagline: 'Gear up your phone',
  },
];

export const NAV_CATEGORIES = [
  { id: 'smartphones', label: 'Mobiles' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'mens-shoes', label: "Men's Shoes" },
  { id: 'womens-shoes', label: "Women's Shoes" },
  { id: 'beauty', label: 'Beauty' },
  { id: 'groceries', label: 'Grocery' },
  { id: 'home-decoration', label: 'Home' },
  { id: 'kitchen-accessories', label: 'Kitchen' },
  { id: 'sports-accessories', label: 'Fitness' },
  { id: 'mens-shirts', label: 'Fashion' },
];

export function getCategoryById(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryIcon(id: string): LucideIcon {
  return getCategoryById(id)?.icon ?? Package;
}
