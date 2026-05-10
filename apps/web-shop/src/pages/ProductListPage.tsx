import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../modules/products/stores/product.store';
import { useCartStore } from '../modules/cart/stores/cart.store';

const ProductListPage = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const categoryName = p.category?.name || 'Uncategorized';
    return filter === 'All' || categoryName.toLowerCase() === filter.toLowerCase();
  });

  const categories = ['All', 'Smartphones', 'Laptops', 'Fragrances', 'Skincare', 'Groceries'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Our Collection</h1>
          <p className="text-slate-400">Discover {filteredProducts.length} premium products</p>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-300">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-medium">Filter</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filter === cat
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'glass text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 glass rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="group"
            >
              <div className="glass rounded-3xl overflow-hidden premium-shadow group-hover:scale-[1.02] transition-all duration-500 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </Link>
                  <button className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-white text-lg line-clamp-1 hover:text-primary-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => addToCart('user-id', product.id, 1)}
                      className="px-4 py-2 bg-white text-slate-950 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
