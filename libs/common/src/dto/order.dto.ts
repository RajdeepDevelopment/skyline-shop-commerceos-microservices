import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsUUID, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-product-1' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: '123 Main St, New York, NY' })
  @IsString()
  shippingAddress: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  createdAt: Date;
}
