export interface Product {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stockCount: number;
  inStock: boolean;
  tags: string[];
  brand: string | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  availabilityStatus: string;
  returnPolicy: string | null;
  minimumOrderQuantity: number;
  barcode: string | null;
  qrCode: string | null;
  images: string[];
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating' | 'discount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilter;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  reviewerName: string;
  verified: boolean;
  helpfulCount: number;
  authorId: string | null;
  createdAt: string;
}

export interface ReviewDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  distribution: ReviewDistribution[];
}

export interface ReviewResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type ReviewSort = 'newest' | 'oldest' | 'rating-desc' | 'rating-asc' | 'helpful';
