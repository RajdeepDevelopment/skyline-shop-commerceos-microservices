import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '../modules/products/stores/product.store';
import { useCartStore } from '../modules/cart/stores/cart.store';
import { Product } from '../modules/products/types/product.types';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id)
        .then(() => {
          const p = useProductStore.getState().selectedProduct;
          setProduct(p);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-96 glass rounded-3xl mb-12"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-white">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass rounded-[2rem] overflow-hidden aspect-square">
            <img
              src={
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
              }
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images &&
              product.images.length > 0 &&
              product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="glass rounded-xl overflow-hidden aspect-square cursor-pointer hover:border-primary-500/50 transition-all border border-transparent"
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary-400 text-sm font-bold uppercase tracking-wider mb-4">
              <span>{product.category?.name || 'General'}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="text-slate-400">SKU: {product.sku || product.id}</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">{product.name}</h1>
            <p className="text-4xl font-bold text-white mb-8">${product.price}</p>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">{product.description}</p>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 size={20} className="text-green-400" />
              <span>Free Delivery on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck size={20} className="text-primary-400" />
              <span>2 Year Warranty Coverage</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Truck size={20} className="text-indigo-400" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => addToCart('user-id', product.id, 1)}
              className="flex-1 py-5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={22} /> Add to Cart
            </button>
            <button className="p-5 glass hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10">
              <Heart size={22} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
