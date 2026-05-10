import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../modules/cart/stores/cart.store';
import { useAuthStore } from '../modules/auth/stores/auth.store';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const { items, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <p className="text-slate-400 mb-8">Add items to your cart before checking out.</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-500 transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Assuming backend has a create order endpoint
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      // Clear cart
      clearCart('user-id');
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 mx-auto"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We've sent a confirmation email to {user?.email}.
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-500 transition"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-white mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-primary-400" /> Shipping Information
            </h2>
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">First Name</label>
                  <input
                    required
                    defaultValue={user?.firstName}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Address</label>
                <input
                  required
                  defaultValue="123 Main St"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </form>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-primary-400" /> Payment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Card Number</label>
                <input
                  required
                  form="checkout-form"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 sticky top-32">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 truncate pr-4">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="text-white font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-primary-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
