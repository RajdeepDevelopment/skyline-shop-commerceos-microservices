import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import Button from '../../../common/ui/button';
import { Product } from '../types/product.types';
import { toPrice } from '../../../lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  const handleViewDetails = () => {
    onViewDetails(product.id);
  };

  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">
            {product.category || 'General'}
          </span>
          {product.brand && (
            <span className="text-xs text-primary-600 font-medium">{product.brand}</span>
          )}
        </div>

        <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">{product.title}</h3>

        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-500 ml-1">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through mr-2">
                ${toPrice(product.price).toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-slate-900">
              ${toPrice(discountedPrice).toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>

          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
