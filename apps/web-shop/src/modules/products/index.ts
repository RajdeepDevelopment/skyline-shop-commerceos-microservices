// Products module exports
export * from './types/product.types';
export { useProductStore } from './stores/product.store';
export { productService } from './services/product.service';
export { default as ProductCard } from './components/ProductCard';
export { useProducts, useProduct, useCategories, useSearchProducts } from './hooks/useProducts';
import './styles/products.scss';
