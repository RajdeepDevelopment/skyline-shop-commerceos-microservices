export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    thumbnail: string | null;
    brand: string | null;
    category: string;
    discountPercentage: number;
    inStock: boolean;
    stockCount: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  itemId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}
