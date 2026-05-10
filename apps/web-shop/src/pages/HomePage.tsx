import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../modules/products/stores/product.store';
import { useCartStore } from '../modules/cart/stores/cart.store';

const HomePage = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-6 inline-block">
            Summer Sale - Up to 50% Off
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Premium Essentials <br />
            <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              For Your Daily Life
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-10 mx-auto">
            Experience the perfect blend of modern design and exceptional quality. Discover our
            latest collections today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 group"
            >
              Shop Now{' '}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Products</h2>
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-all hover:scale-105"
              >
                <div className="relative mb-4">
                  <img
                    src={
                      product.images?.[0] ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-400">${product.price}</span>
                </div>
                <button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => addToCart('user-id', product.id, 1)}
                  disabled={!product.inStock}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
