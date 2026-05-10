import { motion } from 'framer-motion';
import { useProductStore } from '../modules/products/stores/product.store';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const { categories, isLoading } = useProductStore();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">Loading categories...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
          Browse Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link to="/products" key={category.id || idx} className="block group">
              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl premium-card text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white mb-2 capitalize">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoriesPage;
