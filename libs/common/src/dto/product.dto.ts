import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'LAP-123', description: 'Unique Stock Keeping Unit' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Gaming Laptop', description: 'Product Name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'High-performance gaming laptop with RTX 4080' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1299.99, description: 'Product Price' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 'uuid-category-1', description: 'Optional Category ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}
