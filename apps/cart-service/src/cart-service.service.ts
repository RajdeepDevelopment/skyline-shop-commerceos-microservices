import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@app/database';

@Injectable()
export class CartServiceService {
  constructor(private readonly prisma: DatabaseService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      // Check if user exists, if not create a guest/placeholder user or handle accordingly
      // For now, since we are using 'user-id' from FE, let's ensure the user exists
      let user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        user = await this.prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: `${userId}@example.com`,
            name: 'Guest User',
            passwordHash: 'placeholder',
          },
        });
      }

      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return this.calculateTotal(cart);
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);

    // Check if product exists before adding to cart
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

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

    const item = cart.items.find((i) => i.id === itemId);

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

  private calculateTotal(cart: any) {
    const totalAmount = cart.items.reduce((acc: number, item: any) => {
      return acc + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      ...cart,

      totalAmount,
    };
  }
}
