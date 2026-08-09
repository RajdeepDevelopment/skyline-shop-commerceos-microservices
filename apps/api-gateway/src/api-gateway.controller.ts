import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  UseGuards,
  Get,
  Req,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  All,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as microservices from '@nestjs/microservices';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  LoginDto,
  RegisterDto,
  JwtAuthGuard,
  Public,
  retryWithBackoff,
  CreateProductDto,
  UpdateProductDto,
  CreateOrderDto,
  ProductResponseDto,
  OrderResponseDto,
  RedisSearchService,
  RedisDiscoveryService,
  BehaviourEventType,
  BehaviourEvents,
  Role,
  Roles,
  RolesGuard,
} from '@app/common';
import { EventBusService } from '@app/messaging/event-bus.service';

@Controller()
export class ApiGatewayController implements OnModuleInit {
  private authService: any;
  private orderService: any;
  private productService: any;
  private readonly retryOptions = { maxRetries: 3, scalingDuration: 1000 };

  constructor(
    @Inject('AUTH_PACKAGE') private authClient: microservices.ClientGrpc,
    @Inject('ORDER_PACKAGE') private orderClient: microservices.ClientGrpc,
    @Inject('PRODUCT_PACKAGE') private productClient: microservices.ClientGrpc,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisSearch: RedisSearchService,
    private readonly redisDiscovery: RedisDiscoveryService,
    private readonly eventBus: EventBusService,
  ) {}

  private get serviceUrls() {
    return {
      cart: this.configService.get<string>('CART_SERVICE_URL', 'http://localhost:3002'),
      product: this.configService.get<string>('PRODUCT_SERVICE_URL', 'http://localhost:3003'),
      inventory: this.configService.get<string>('INVENTORY_SERVICE_URL', 'http://localhost:3004'),
      payment: this.configService.get<string>('PAYMENT_SERVICE_URL', 'http://localhost:3007'),
      availability: this.configService.get<string>(
        'AVAILABILITY_SERVICE_URL',
        'http://localhost:3009',
      ),
    };
  }

  private async proxyRequest(method: string, url: string, req: any, overrideUrl?: string) {
    const target = `${url}${(overrideUrl ?? req.url).replace(/^\/api\/v1/, '')}`;
    const response = await firstValueFrom(
      this.httpService.request({
        method: method as any,
        url: target,
        data: req.body,
        headers: {
          authorization: req.headers.authorization || '',
          'content-type': req.headers['content-type'] || 'application/json',
        },
      }),
    );
    return response.data;
  }

  onModuleInit(): void {
    this.authService = this.authClient.getService<any>('AuthService');

    this.orderService = this.orderClient.getService<any>('OrderService');

    this.productService = this.productClient.getService<any>('ProductService');
  }

  private actorKey(req: any): string {
    const sub = req?.user?.sub;
    if (sub) return `user:${sub}`;
    const anon = req?.headers?.['x-anonymous-id'];
    return anon ? `guest:${anon}` : 'guest:anon';
  }

  private async hydrateProductsByIds(ids: string[], limit = 20) {
    const unique = [...new Set(ids)].filter(Boolean).slice(0, limit);
    if (unique.length === 0) return [];
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/by-ids`, {
        params: { ids: unique.join(',') },
      }),
    );
    return Array.isArray(response.data) ? response.data : [];
  }

  // =====================================================
  // AUTH SERVICE
  // =====================================================

  @Public()
  @Post('auth/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login to obtain JWT token' })
  @ApiResponse({ status: 200, description: 'Return JWT access and refresh tokens' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result: any = await firstValueFrom(
      this.authService.login(dto).pipe(retryWithBackoff(this.retryOptions)),
    );

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('auth/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() dto: RegisterDto) {
    return firstValueFrom(this.authService.register(dto).pipe(retryWithBackoff(this.retryOptions)));
  }

  @Post('auth/logout')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Logout and clear tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  // =====================================================
  // PRODUCT SERVICE
  // =====================================================

  @Public()
  @Get('products')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get products with pagination, search, and filters' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAllProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('instock') instock?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return firstValueFrom(
      this.productService.findAll({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        search: search || '',
        category: category || '',
        minPrice: minPrice ? parseFloat(minPrice) : 0,
        maxPrice: maxPrice ? parseFloat(maxPrice) : 0,
        minRating: rating ? parseFloat(rating) : 0,
        inStock: instock === 'true',
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      }),
    );
  }

  @Public()
  @Get('products/categories')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get all categories' })
  async findCategories() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/categories`),
    );
    return response.data;
  }

  @Public()
  @Get('products/search')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Search products' })
  async searchProducts(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('instock') instock?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return firstValueFrom(
      this.productService.findAll({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        search: q || '',
        category: category || '',
        minPrice: minPrice ? parseFloat(minPrice) : 0,
        maxPrice: maxPrice ? parseFloat(maxPrice) : 0,
        minRating: rating ? parseFloat(rating) : 0,
        inStock: instock === 'true',
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      }),
    );
  }

  // =====================================================
  // SEARCH — Autocomplete, Recent, Popular
  // =====================================================

  @Public()
  @Get('products/suggest')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Autocomplete search suggestions' })
  async suggestProducts(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/suggest`, {
        params: { q, limit, category },
      }),
    );
    return response.data;
  }

  @Public()
  @Get('products/recent')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get recent searches for current user' })
  async getRecentSearches(@Query('limit') limit?: string, @Req() req?: any) {
    const userId = req?.user?.sub;
    return this.redisSearch.getRecentSearches(userId, parseInt(limit || '8', 10));
  }

  @Public()
  @Get('products/popular')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get popular/trending search terms' })
  async getPopularSearches(@Query('limit') limit?: string) {
    return this.redisSearch.getPopularSearches(parseInt(limit || '8', 10));
  }

  @Public()
  @Post('products/track-search')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Track a search query for recent/popular' })
  async trackSearch(@Body() body: { query: string }, @Req() req?: any) {
    const userId = req?.user?.sub;
    const query = body.query?.trim();
    if (!query) return { ok: true };

    await Promise.all([
      this.redisSearch.addRecentSearch(userId, query),
      this.redisSearch.trackPopularSearch(query),
    ]);
    return { ok: true };
  }

  // =====================================================
  // BEHAVIOUR EVENTS — single entry point for all tracking
  // =====================================================

  @Public()
  @Post('events')
  @ApiTags('Discovery')
  @ApiOperation({
    summary: 'Record a behaviour event (view, click, cart, wishlist, purchase, ...)',
  })
  async trackEvent(
    @Body()
    body: {
      eventType: BehaviourEventType;
      productId?: string;
      category?: string;
      quantity?: number;
      payload?: Record<string, unknown>;
    },
    @Req() req?: any,
  ) {
    const eventType = body?.eventType as BehaviourEventType | undefined;
    if (!eventType || !(eventType in BehaviourEventType)) {
      return { ok: false, error: `Invalid eventType: ${eventType}` };
    }

    const userId = req?.user?.sub || undefined;
    const event = {
      eventType,
      userId,
      sessionId: req?.headers?.['x-session-id'] || undefined,
      productId: body?.productId,
      category: body?.category,
      quantity: body?.quantity,
      payload: body?.payload,
      timestamp: new Date().toISOString(),
    };

    const actorKey = this.actorKey(req);
    await Promise.all([
      this.redisDiscovery.trackEvent(event, actorKey),
      this.eventBus.publish(BehaviourEvents.EVENT, event).catch(() => undefined),
    ]);
    return { ok: true };
  }

  @Public()
  @Post('products/:id/view')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Track a product view' })
  async trackProductView(@Param('id', ParseUUIDPipe) id: string, @Req() req?: any) {
    const event = {
      eventType: BehaviourEventType.PRODUCT_VIEW,
      userId: req?.user?.sub || undefined,
      sessionId: req?.headers?.['x-session-id'] || undefined,
      productId: id,
      timestamp: new Date().toISOString(),
    };
    const actorKey = this.actorKey(req);
    await Promise.all([
      this.redisDiscovery.trackEvent(event, actorKey),
      this.eventBus.publish(BehaviourEvents.EVENT, event).catch(() => undefined),
    ]);
    return { ok: true };
  }

  // =====================================================
  // DISCOVERY — ranked lists served from Redis
  // =====================================================

  @Public()
  @Get('discovery/trending')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Trending products (ranked by the ranking engine)' })
  async discoveryTrending(@Query('category') category?: string, @Query('limit') limit?: string) {
    const ids = await this.redisDiscovery.getRankedList(
      'trending',
      category || 'global',
      parseInt(limit || '20', 10),
    );
    return this.hydrateProductsByIds(ids, parseInt(limit || '20', 10));
  }

  @Public()
  @Get('discovery/best-sellers')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Best selling products (ranked by the ranking engine)' })
  async discoveryBestSellers(@Query('category') category?: string, @Query('limit') limit?: string) {
    const ids = await this.redisDiscovery.getRankedList(
      'bestsellers',
      category || 'global',
      parseInt(limit || '20', 10),
    );
    return this.hydrateProductsByIds(ids, parseInt(limit || '20', 10));
  }

  @Public()
  @Get('discovery/deals')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Active deals (ranked by discount + demand)' })
  async discoveryDeals(@Query('limit') limit?: string) {
    const ids = await this.redisDiscovery.getRankedList(
      'deals',
      'global',
      parseInt(limit || '20', 10),
    );
    return this.hydrateProductsByIds(ids, parseInt(limit || '20', 10));
  }

  @Public()
  @Get('discovery/home')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Homepage sections: trending, deals, best sellers, recommendations' })
  async discoveryHome(@Req() req?: any) {
    const [trending, deals, bestSellers, recentlyViewed, recommendations] = await Promise.all([
      this.discoveryTrending(undefined, '20'),
      this.discoveryDeals('20'),
      this.discoveryBestSellers(undefined, '20'),
      this.getUserRecentProducts('12', req),
      this.getRecommendations('12', req),
    ]);
    return { trending, deals, bestSellers, recentlyViewed, recommendations };
  }

  @Public()
  @Get('recommendations')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Personalized recommendations based on browsing history' })
  async getRecommendations(@Query('limit') limit?: string, @Req() req?: any) {
    const actorKey = this.actorKey(req);
    const recent = await this.redisDiscovery.getRecentViewed(actorKey, 12);
    const meta = await this.redisDiscovery.getProductsMeta(recent);
    const categories = Object.values(meta)
      .map((m) => m?.category)
      .filter(Boolean);
    const category = categories[0];
    if (category) {
      const ids = await this.redisDiscovery.getRankedList('trending', category, 20);
      if (ids.length > 0) {
        return this.hydrateProductsByIds(ids, parseInt(limit || '12', 10));
      }
    }
    const fallback = await this.redisDiscovery.getRankedList('bestsellers', 'global', 20);
    return this.hydrateProductsByIds(fallback, parseInt(limit || '12', 10));
  }

  @Public()
  @Get('user/recent-products')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Products recently viewed by the current user' })
  async getUserRecentProducts(@Query('limit') limit?: string, @Req() req?: any) {
    const actorKey = this.actorKey(req);
    const ids = await this.redisDiscovery.getRecentViewed(actorKey, parseInt(limit || '12', 10));
    return this.hydrateProductsByIds(ids, parseInt(limit || '12', 10));
  }

  @Public()
  @Get('products/by-ids')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Bulk fetch products by ids' })
  async findProductsByIds(@Query('ids') ids?: string) {
    const list = (ids || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return this.hydrateProductsByIds(list, 50);
  }

  @Public()
  @Get('products/:id/availability')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Pincode-based delivery availability for a product SKU' })
  async checkProductAvailability(
    @Param('id') id: string,
    @Query('pincode') pincode: string,
    @Query('quantity') quantity?: string,
  ) {
    const params = new URLSearchParams({ pincode: pincode || '' });
    if (quantity) params.set('quantity', quantity);
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.serviceUrls.availability}/products/${encodeURIComponent(id)}/availability?${params.toString()}`,
      ),
    );
    return response.data;
  }

  @Post('availability/reservations')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Reserve stock for a SKU + pincode (checkout)' })
  async reserveStock(
    @Body() dto: { sku: string; pincode: string; quantity: number; orderId?: string },
  ) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.serviceUrls.availability}/availability/reservations`, dto),
    );
    return response.data;
  }

  @Post('availability/reservations/:id/confirm')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Confirm a stock reservation (payment success)' })
  async confirmReservation(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.serviceUrls.availability}/availability/reservations/${id}/confirm`,
      ),
    );
    return response.data;
  }

  @Post('availability/reservations/:id/release')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Release a stock reservation (cart abandoned / order cancelled)' })
  async releaseReservation(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.serviceUrls.availability}/availability/reservations/${id}/release`,
      ),
    );
    return response.data;
  }

  @Public()
  @Get('products/:id/similar')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Similar products (OpenSearch similarity)' })
  async findSimilarProducts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/${id}/similar`, {
        params: { limit },
      }),
    );
    return response.data;
  }

  @Public()
  @Get('products/:id/frequently-bought')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Frequently bought together (co-purchase analysis)' })
  async frequentlyBought(@Param('id', ParseUUIDPipe) id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/${id}/frequently-bought`),
    );
    return response.data;
  }

  // =====================================================
  // ADMIN — merchandising overrides
  // =====================================================

  @Post('admin/discovery/boost')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('JWT')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Boost a product in discovery rankings (admin)' })
  async boostProduct(@Body() dto: { productId: string; score?: number; ttlDays?: number }) {
    const score = Math.max(0, Math.min(100, dto.score ?? 50));
    await this.redisDiscovery.setBoost(dto.productId, score, dto.ttlDays || 7);
    return { ok: true, productId: dto.productId, score };
  }

  @Delete('admin/discovery/boost/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('JWT')
  @ApiTags('Discovery')
  @ApiOperation({ summary: 'Remove a product boost (admin)' })
  async removeBoost(@Param('productId') productId: string) {
    await this.redisDiscovery.clearBoost(productId);
    return { ok: true };
  }

  // =====================================================
  // PRODUCT BY ID
  // =====================================================

  @Public()
  @Get('products/:id')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findOneProduct(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(this.productService.findOne({ id }));
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Create new product (Admin)' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async createProduct(@Body() dto: CreateProductDto) {
    return firstValueFrom(this.productService.create(dto));
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Update product (Admin)' })
  async updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return firstValueFrom(this.productService.update({ id, ...dto }));
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Soft delete product (Admin)' })
  async removeProduct(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(this.productService.remove({ id }));
  }

  // =====================================================
  // PRODUCT REVIEWS
  // =====================================================

  @Public()
  @Get('products/:id/reviews')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get product reviews with filters and sorting' })
  async getProductReviews(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('rating') rating?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/${id}/reviews`, {
        params: { rating, sort, page, limit },
      }),
    );
    return response.data;
  }

  @Public()
  @Get('products/:id/reviews/summary')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get product review summary and rating distribution' })
  async getProductReviewSummary(@Param('id', ParseUUIDPipe) id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.serviceUrls.product}/products/${id}/reviews/summary`),
    );
    return response.data;
  }

  @Post('products/:id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Write a review for a product' })
  async createProductReview(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { rating: number; title?: string; comment?: string; reviewerName?: string },
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.serviceUrls.product}/products/${id}/reviews`,
        {
          rating: dto?.rating,
          title: dto?.title,
          comment: dto?.comment,
          reviewerName: dto?.reviewerName?.trim() || req.user?.email || '',
          reviewerEmail: req.user?.email || '',
        },
        {
          headers: {
            'x-user-id': req.user?.sub || '',
            'content-type': 'application/json',
          },
        },
      ),
    );
    return response.data;
  }

  @Post('products/:id/reviews/:reviewId/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Mark a review as helpful' })
  async markReviewHelpful(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.serviceUrls.product}/products/${id}/reviews/${reviewId}/helpful`,
        {},
        {
          headers: {
            'x-user-id': req.user?.sub || '',
            'content-type': 'application/json',
          },
        },
      ),
    );
    return response.data;
  }

  // =====================================================
  // ORDER SERVICE
  // =====================================================

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Orders')
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user.sub;

    const result = await firstValueFrom(this.orderService.createOrder({ ...dto, userId }));

    // Emit PURCHASE behaviour events so the ranking engine can track sales demand.
    const items = Array.isArray(dto?.items) ? dto.items : [];
    if (items.length > 0) {
      const timestamp = new Date().toISOString();
      const sessionId = req?.headers?.['x-session-id'] || undefined;
      for (const item of items) {
        const event = {
          eventType: BehaviourEventType.PURCHASE,
          userId,
          sessionId,
          productId: item.productId,
          quantity: item.quantity || 1,
          timestamp,
        };
        await Promise.all([
          this.redisDiscovery.trackEvent(event, `user:${userId}`),
          this.eventBus.publish(BehaviourEvents.EVENT, event).catch(() => undefined),
        ]);
      }
    }

    return result;
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Orders')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async getOrders(@Req() req: any) {
    const userId = req.user.sub;

    return firstValueFrom(this.orderService.getUserOrders({ userId, page: 1, pageSize: 20 }));
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Orders')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return firstValueFrom(this.orderService.getOrder({ orderId: id }));
  }

  // =====================================================
  // CART SERVICE (HTTP Proxy)
  // =====================================================

  @All('cart/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Cart')
  @ApiOperation({ summary: 'Proxy requests to Cart Service' })
  async proxyCart(@Req() req: any) {
    // Cart Service routes are scoped per-user (`/cart/:userId/items`). Callers
    // may already include the user id in the path (`/api/v1/cart/:userId/...`,
    // the FE convention) or omit it (`/api/v1/cart/items`). Inject the id from
    // the JWT (`sub`) only when it is missing.
    const suffix = req.url.replace(/^\/api\/v1\/cart/, ''); // '', '/items', '/:userId/items', ...
    const segments = suffix.split('/').filter(Boolean);
    const path =
      segments.length > 0 && segments[0] !== 'items' ? suffix : `/${req.user?.sub}${suffix}`;
    return this.proxyRequest(req.method, this.serviceUrls.cart, req, `/api/v1/cart${path}`);
  }

  // =====================================================
  // INVENTORY SERVICE (HTTP Proxy)
  // =====================================================

  @All('inventory/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Inventory')
  @ApiOperation({ summary: 'Proxy requests to Inventory Service' })
  async proxyInventory(@Req() req: any) {
    return this.proxyRequest(req.method, this.serviceUrls.inventory, req);
  }

  // =====================================================
  // PAYMENT SERVICE (HTTP Proxy)
  // =====================================================

  @All('payment/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Payment')
  @ApiOperation({ summary: 'Proxy requests to Payment Service' })
  async proxyPayment(@Req() req: any) {
    return this.proxyRequest(req.method, this.serviceUrls.payment, req);
  }
}
