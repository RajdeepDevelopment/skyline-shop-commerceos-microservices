import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryProvider } from './lib/query-client';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { crossTabSync } from './lib/cross-tab-sync';
import { Toaster } from './components/ui/toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/AboutPage';
import CategoriesPage from './pages/CategoriesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import DealsPage from './pages/DealsPage';
import WishlistPage from './pages/WishlistPage';
import RecentlyViewedPage from './pages/RecentlyViewedPage';
import ComparePage from './pages/ComparePage';
import AccountPage from './pages/AccountPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  const { handleCrossTabLogout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = crossTabSync.onLogout(() => {
      handleCrossTabLogout();
    });
    return unsubscribe;
  }, [handleCrossTabLogout]);

  return (
    <QueryProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
          <Navbar />
          <main className="min-h-[70vh]">
            <ErrorBoundary>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
                <Route path="/compare" element={<ComparePage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id/track" element={<TrackOrderPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                </Route>

                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center py-40">
                      <h1 className="text-6xl font-bold text-foreground">404</h1>
                      <p className="mb-8 text-muted-foreground">Page not found</p>
                      <a href="/" className="font-semibold text-primary hover:underline">
                        Go back home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
          <BottomNav />
        </div>
        <Toaster />
      </Router>
    </QueryProvider>
  );
}

export default App;
