import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Headers,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ElasticsearchSearchService, SearchProduct, RedisDiscoveryService } from '@app/common';
import { ProductServiceService } from './product-service.service';

@Controller('categories')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @Get()
  async findCategories() {
    return this.productServiceService.findCategories();
  }
}

@Controller('products')
export class ProductSearchController {
  private readonly logger = new Logger(ProductSearchController.name);

  constructor(
    private readonly productServiceService: ProductServiceService,
    private readonly esService: ElasticsearchSearchService,
    private readonly redisDiscovery: RedisDiscoveryService,
  ) {}

  @Get('suggest')
  async suggest(@Query('q') q: string, @Query('limit') limit?: string) {
    return this.esService.suggest(q || '', undefined, parseInt(limit || '8', 10));
  }

  @Get('by-ids')
  async findByIds(@Query('ids') ids?: string) {
    const list = (ids || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return this.productServiceService.findByIds(list);
  }

  @Get(':id/frequently-bought')
  async frequentlyBought(@Param('id') id: string) {
    const cached = await this.redisDiscovery.getFrequentlyBought(id, 4);
    if (cached.length > 0) {
      const products = await this.productServiceService.findByIds(cached);
      if (products.length > 0) return products;
    }
    // Fallback: top-rated products from the same category.
    const similar = await this.productServiceService.findSimilar(id, 4);
    return similar.filter((p) => p.id !== id);
  }

  @Get(':id/similar')
  async similar(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.productServiceService.findSimilar(id, parseInt(limit || '8', 10));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const p = await this.productServiceService.findOne(id);
    if (!p) {
      return null;
    }
    return {
      id: p.id,
      sku: p.sku || '',
      title: p.title || '',
      description: p.description || '',
      price: Number(p.price) || 0,
      isActive: p.isActive ?? true,
      createdAt: p.createdAt?.toISOString?.() || String(p.createdAt),
      category: p.category || '',
      images: p.images || [],
      inStock: p.inStock ?? (p.stock ?? 0) > 0,
      stockCount: p.stockCount ?? p.stock ?? 0,
      brand: p.brand || '',
      rating: Number(p.rating) || 0,
      discountPercentage: Number(p.discountPercentage) || 0,
      thumbnail: p.thumbnail || '',
      tags: p.tags || [],
    };
  }

  @Get(':id/reviews')
  async findReviews(
    @Param('id') id: string,
    @Query('rating') rating?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productServiceService.findReviews(id, {
      rating: rating ? parseInt(rating, 10) : undefined,
      sort: sort || 'newest',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id/reviews/summary')
  async reviewSummary(@Param('id') id: string) {
    return this.productServiceService.getReviewSummary(id);
  }

  @Post(':id/reviews')
  async createReview(
    @Param('id') id: string,
    @Body()
    dto: {
      rating: number;
      title?: string;
      comment?: string;
      reviewerName?: string;
      reviewerEmail?: string;
    },
    @Headers('x-user-id') userId?: string,
  ) {
    const rating = Number(dto?.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }
    const review = await this.productServiceService.createReview(id, {
      ...dto,
      rating,
      authorId: userId || undefined,
    });
    if (!review) throw new BadRequestException('Product not found');
    return review;
  }

  @Post(':id/reviews/:reviewId/helpful')
  async markReviewHelpful(
    @Param('id') id: string,
    @Param('reviewId') reviewId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    if (!userId) throw new BadRequestException('User ID is required');
    return this.productServiceService.setReviewHelpful(reviewId, userId);
  }

  @Post('sync-index')
  async syncIndex(@Query('batch') batch?: string, @Query('offset') offset?: string) {
    const batchSize = Math.min(parseInt(batch || '5000', 10), 10000);
    const startOffset = parseInt(offset || '0', 10);

    this.logger.log(`Starting ES sync: batchSize=${batchSize}, offset=${startOffset}`);

    let synced = 0;
    let hasMore = true;

    while (hasMore) {
      const products = await this.productServiceService.findAll({
        page: Math.floor(startOffset / batchSize) + synced / batchSize + 1,
        limit: batchSize,
      });

      if (!products.products || products.products.length === 0) {
        hasMore = false;
        break;
      }

      const esProducts: SearchProduct[] = products.products.map((p: any) => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        description: p.description || '',
        price: parseFloat(String(p.price)),
        stock: p.stock ?? 0,
        category: p.category || '',
        thumbnail: p.thumbnail || (p.images as string[])?.[0] || '',
        brand: p.brand || '',
        rating: parseFloat(String(p.rating ?? 0)),
        tags: p.tags || [],
        discountPercentage: parseFloat(String(p.discountPercentage ?? 0)),
        availabilityStatus: p.availabilityStatus || (p.stock > 0 ? 'In Stock' : 'Out of Stock'),
        isActive: p.isActive,
        inStock: p.inStock,
        createdAt: p.createdAt?.toISOString?.() || new Date(p.createdAt).toISOString(),
        updatedAt: p.updatedAt?.toISOString?.() || new Date(p.updatedAt).toISOString(),
      }));

      const result = await this.esService.bulkIndexProducts(esProducts);
      synced += result.indexed;

      this.logger.log(`Synced batch: ${result.indexed}/${esProducts.length} (total: ${synced})`);

      if (products.products.length < batchSize) hasMore = false;
    }

    const stats = await this.esService.getStats();
    return { synced, totalInIndex: stats.documentCount, complete: true };
  }
}

@Controller()
export class ProductGrpcController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @GrpcMethod('ProductService', 'Create')
  create(data: any) {
    return this.productServiceService.create(data);
  }

  @GrpcMethod('ProductService', 'FindAll')
  async findAll(data: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const result = await this.productServiceService.findAll(data);
    return {
      products: (result.products || []).map((p: any) => ({
        id: p.id,
        sku: p.sku || '',
        title: p.title || '',
        description: p.description || '',
        price: Number(p.price) || 0,
        isActive: p.isActive ?? true,
        createdAt: p.createdAt?.toISOString?.() || String(p.createdAt),
        category: p.category || '',
        images: p.images || [],
        inStock: p.inStock ?? (p.stock ?? 0) > 0,
        stockCount: p.stockCount ?? p.stock ?? 0,
        brand: p.brand || '',
        rating: Number(p.rating) || 0,
        discountPercentage: Number(p.discountPercentage) || 0,
        thumbnail: p.thumbnail || '',
        tags: p.tags || [],
      })),
      total: result.total || 0,
      page: result.page || 1,
      totalPages: result.totalPages || 1,
      limit: result.limit || 20,
    };
  }

  @GrpcMethod('ProductService', 'FindOne')
  async findOne(data: { id: string }) {
    const p = await this.productServiceService.findOne(data.id);
    if (!p) return {};
    return {
      id: p.id,
      sku: p.sku || '',
      title: p.title || '',
      description: p.description || '',
      price: Number(p.price) || 0,
      isActive: p.isActive ?? true,
      createdAt: p.createdAt?.toISOString?.() || String(p.createdAt),
      category: p.category || '',
      images: p.images || [],
      inStock: p.inStock ?? (p.stock ?? 0) > 0,
      stockCount: p.stockCount ?? p.stock ?? 0,
      brand: p.brand || '',
      rating: Number(p.rating) || 0,
      discountPercentage: Number(p.discountPercentage) || 0,
      thumbnail: p.thumbnail || '',
      tags: p.tags || [],
      inventoryQty: p.inventory?.quantity ?? 0,
      inventoryReserved: p.inventory?.reservedQty ?? 0,
    };
  }

  @GrpcMethod('ProductService', 'Update')
  update(data: any) {
    return this.productServiceService.update(data.id, data);
  }

  @GrpcMethod('ProductService', 'Remove')
  remove(data: { id: string }) {
    return this.productServiceService.remove(data.id);
  }
}
