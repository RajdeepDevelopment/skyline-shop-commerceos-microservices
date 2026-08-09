import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartServiceService {
  private readonly logger = new Logger(CartServiceService.name);
  private readonly productServiceUrl: string;

  constructor(
    private readonly prisma: DatabaseService,
    private readonly httpService: HttpService,
  ) {
    this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003';
  }

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      let user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        user = await this.prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: `${userId}@guest.local`,
            name: 'Guest User',
            passwordHash: 'placeholder',
          },
        });
      }

      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: true,
        },
      });
    }

    const enrichedItems = await this.enrichCartItems(cart.items);
    return this.calculateTotal({ ...cart, items: enrichedItems });
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);

    const product = await this.findProduct(productId);

    const existingItem = cart.items.find((item: any) => item.productId === productId);

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getCart(userId);

    const item = cart.items.find((i: any) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }

  private async findProduct(productId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`),
      );
      return response.data;
    } catch {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  private async enrichCartItems(items: any[]) {
    const productIds = items.map((item) => item.productId);
    if (productIds.length === 0) return items;

    const products = await Promise.all(
      productIds.map(async (id) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get(`${this.productServiceUrl}/products/${id}`),
          );
          return response.data;
        } catch {
          return null;
        }
      }),
    );

    const productMap = new Map(products.filter(Boolean).map((p: any) => [p.id, p]));

    return items.map((item) => ({
      ...item,
      product: productMap.get(item.productId) || {
        id: item.productId,
        title: 'Unknown Product',
        price: 0,
        thumbnail: '',
        stock: 0,
        inStock: false,
      },
    }));
  }

  private calculateTotal(cart: any) {
    const subtotal = cart.items.reduce((acc: number, item: any) => {
      const price = Number(item.product?.price || 0);
      return acc + price * item.quantity;
    }, 0);

    const discount = cart.items.reduce((acc: number, item: any) => {
      const price = Number(item.product?.price || 0);
      const pct = Number(item.product?.discountPercentage || 0);
      return acc + price * (pct / 100) * item.quantity;
    }, 0);

    const totalAmount = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

    return {
      ...cart,
      subtotal,
      discount,
      totalAmount,
    };
  }
}
