import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Button from '../../../common/ui/button';
import { CartItem as CartItemType } from '../types/cart.types';
import { toPrice } from '../../../lib/utils';

interface CartItemComponentProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
      <img
        src={item.product.images[0] || '/placeholder-product.jpg'}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-md"
      />

      <div className="flex-1">
        <h3 className="font-medium text-slate-900">{item.product.title}</h3>
        <p className="text-slate-500">${toPrice(item.product.price).toFixed(2)}</p>
        {!item.product.inStock && <p className="text-red-500 text-sm">Out of stock</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecreaseQuantity}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncreaseQuantity}
          disabled={!item.product.inStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-medium text-slate-900">
          ${(toPrice(item.product.price) * item.quantity).toFixed(2)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItemComponent;
