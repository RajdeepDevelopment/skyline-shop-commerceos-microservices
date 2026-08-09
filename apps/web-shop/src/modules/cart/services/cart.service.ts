import { Cart, AddToCartRequest, UpdateCartRequest } from '../types/cart.types';
import { cartApi } from '../../../lib/axios';

export class CartService {
  async getCart(userId: string): Promise<Cart> {
    const response = await cartApi.get<Cart>(`/api/v1/cart/${userId}`);
    return response.data;
  }

  async addToCart(userId: string, request: AddToCartRequest): Promise<Cart> {
    const response = await cartApi.post<Cart>(`/api/v1/cart/${userId}/items`, request);
    return response.data;
  }

  async updateCartItem(userId: string, request: UpdateCartRequest): Promise<Cart> {
    const response = await cartApi.put<Cart>(`/api/v1/cart/${userId}/items/${request.itemId}`, {
      quantity: request.quantity,
    });
    return response.data;
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const response = await cartApi.delete<Cart>(`/api/v1/cart/${userId}/items/${itemId}`);
    return response.data;
  }

  async clearCart(userId: string): Promise<void> {
    await cartApi.delete(`/api/v1/cart/${userId}`);
  }
}

export const cartService = new CartService();
