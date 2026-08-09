import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsInt, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'P-0000-V000001', description: 'Unique Stock Keeping Unit' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Gaming Laptop', description: 'Product title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'High-performance gaming laptop with RTX 4080' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'laptops', description: 'Product category' })
  @IsString()
  category: string;

  @ApiProperty({ example: 1299.99, description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 'TechCorp' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsInt()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ type: [String], example: ['laptop', 'deals'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 0.2, description: 'Weight in kilograms' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: 32, description: 'Width in centimeters' })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ example: 2, description: 'Height in centimeters' })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ example: 22, description: 'Depth in centimeters' })
  @IsNumber()
  @IsOptional()
  depth?: number;

  @ApiPropertyOptional({ example: '1 year warranty' })
  @IsString()
  @IsOptional()
  warrantyInformation?: string;

  @ApiPropertyOptional({ example: 'Ships in 24h' })
  @IsString()
  @IsOptional()
  shippingInformation?: string;

  @ApiPropertyOptional({ example: 'In Stock' })
  @IsString()
  @IsOptional()
  availabilityStatus?: string;

  @ApiPropertyOptional({ example: '30 day returns' })
  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({ example: '100000000001' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: 'QR-1234' })
  @IsString()
  @IsOptional()
  qrCode?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}
