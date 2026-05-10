import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './lib/query-client';
import { useAuthStore } from './modules/auth/stores/auth.store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/AboutPage';
import CategoriesPage from './pages/CategoriesPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Loading } from './common/ui/loading';

function App() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <Loading text="Loading application..." size="lg" />
      </div>
    );
  }

  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary-500/30">
          <Navbar />
          <main className="min-h-[80vh]">
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

              {/* Protected Routes (Checkout, Profile, etc.) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>

              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center py-40">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-slate-400 mb-8">Page not found</p>
                    <a href="/" className="text-primary-400 hover:underline">
                      Go back home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
