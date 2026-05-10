import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { useCartStore } from '../../modules/cart/stores/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            SKYLINE<span className="text-primary-400">SHOP</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-primary-400 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary-400 transition-colors">
            Shop
          </Link>
          <Link to="/categories" className="hover:text-primary-400 transition-colors">
            Categories
          </Link>
          <Link to="/about" className="hover:text-primary-400 transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search size={18} className="absolute left-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (window.location.pathname !== '/products') {
                  navigate('/products');
                }
              }}
              className="bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <Link
            to="/cart"
            className="p-2 hover:bg-white/5 rounded-full transition-colors relative text-slate-300"
          >
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 text-[10px] flex items-center justify-center rounded-full text-white font-bold">
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                {items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative group flex items-center gap-4">
              <span className="hidden md:block text-sm font-medium text-slate-300">
                Hi, {user?.firstName || 'User'}
              </span>
              <button
                onClick={logout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors text-slate-300"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 p-2 px-4 hover:bg-primary-500/10 hover:text-primary-400 rounded-full transition-colors text-slate-300 font-medium"
            >
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-slate-300"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-white/10 mt-4 py-4"
          >
            <div className="flex flex-col gap-4 px-6">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-primary-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-primary-400 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-primary-400 transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 hover:text-primary-400 transition-colors"
              >
                About
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-primary-400 font-medium border-t border-white/10 mt-2 pt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
