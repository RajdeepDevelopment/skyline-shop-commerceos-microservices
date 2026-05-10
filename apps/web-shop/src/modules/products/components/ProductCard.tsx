import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import Button from '../../../common/ui/button';
import { Product } from '../types/product.types';

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

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">
            {product.category.name}
          </span>
        </div>

        <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">{product.name}</h3>

        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          </div>
          <div className="text-sm text-slate-500">
            {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
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
