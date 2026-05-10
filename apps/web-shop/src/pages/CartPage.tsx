import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../modules/cart/stores/cart.store';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-500">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-slate-400 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Go ahead and explore our featured
          products.
        </p>
        <Link
          to="/products"
          className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 group relative overflow-hidden"
              >
                <img
                  src={item.product.images?.[0]}
                  className="w-32 h-32 object-cover rounded-2xl"
                  alt={item.product.name}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.product.name}</h3>
                    </div>
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => removeFromCart('user-id', item.id)}
                      className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1 border border-white/10">
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => updateQuantity('user-id', item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-bold min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => updateQuantity('user-id', item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-3xl sticky top-32">
            <h2 className="text-2xl font-bold text-white mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span className="text-white font-medium">$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-2xl font-bold text-white">
                <span>Total</span>
                <span className="text-primary-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 block text-center"
            >
              Checkout Now
            </Link>

            <p className="text-center text-slate-500 text-xs mt-6">
              Tax and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
