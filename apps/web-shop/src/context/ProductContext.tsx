import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  total: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shopping_cart');

    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    import('../api/apiClient').then(({ apiClient }) => {
      apiClient<{ products: any[] }>('/products')
        .then((data) => {
          // Map DB products to the frontend interface format since images/ratings aren't in the DB schema
          const mappedProducts: Product[] = data.products.map((p) => ({
            id: p.id,

            title: p.name,

            description: p.description || '',

            price: parseFloat(p.price) || 0,
            rating: 4.5, // Mock rating
            stock: 100, // Mock stock

            category: p.categoryId || 'General',
            // Provide a reliable fallback image

            thumbnail: `https://picsum.photos/seed/${p.sku}/300/300`,

            images: [`https://picsum.photos/seed/${p.sku}/600/600`],
          }));
          setProducts(mappedProducts);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch products from backend:', err);
          setLoading(false);
        });
    });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
