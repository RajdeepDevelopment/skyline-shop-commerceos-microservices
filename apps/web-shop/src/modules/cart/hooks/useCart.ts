import { useMutation, useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import { Cart, AddToCartRequest, UpdateCartRequest } from '../types/cart.types';

export const useCart = (userId: string) => {
  return useQuery<Cart, Error>({
    queryKey: ['cart', userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
  });
};

export const useAddToCart = () => {
  return useMutation<Cart, Error, { userId: string; request: AddToCartRequest }>({
    mutationFn: ({ userId, request }) => cartService.addToCart(userId, request),
  });
};

export const useUpdateCartItem = () => {
  return useMutation<Cart, Error, { userId: string; request: UpdateCartRequest }>({
    mutationFn: ({ userId, request }) => cartService.updateCartItem(userId, request),
  });
};

export const useRemoveFromCart = () => {
  return useMutation<Cart, Error, { userId: string; itemId: string }>({
    mutationFn: ({ userId, itemId }) => cartService.removeFromCart(userId, itemId),
  });
};

export const useClearCart = () => {
  return useMutation<void, Error, string>({
    mutationFn: (userId) => cartService.clearCart(userId),
  });
};
