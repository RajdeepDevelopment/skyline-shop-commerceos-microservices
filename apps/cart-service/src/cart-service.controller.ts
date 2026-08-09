import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CartServiceService } from './cart-service.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart/:userId')
@UseInterceptors(ClassSerializerInterceptor)
export class CartServiceController {
  constructor(private readonly cartService: CartServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(
    @Param('userId') userId: string,
    @Body() dto: { productId: string; quantity: number },
  ) {
    return this.cartService.addToCart(userId, dto.productId, dto.quantity);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateQuantity(
    @Param('userId') userId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: { quantity: number },
  ) {
    return this.cartService.updateQuantity(userId, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(
    @Param('userId') userId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
