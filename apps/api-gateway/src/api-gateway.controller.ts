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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
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
} from '@app/common';

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
  ) {}

  onModuleInit(): void {
    this.authService = this.authClient.getService<any>('AuthService');

    this.orderService = this.orderClient.getService<any>('OrderService');

    this.productService = this.productClient.getService<any>('ProductService');
  }

  // =====================================================
  // AUTH SERVICE
  // =====================================================

  @Public()
  @Post('auth/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login to obtain JWT token' })
  @ApiResponse({ status: 200, description: 'Return JWT access and refresh tokens' })
  async login(@Body() dto: LoginDto) {
    return firstValueFrom(this.authService.login(dto).pipe(retryWithBackoff(this.retryOptions)));
  }

  @Public()
  @Post('auth/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() dto: RegisterDto) {
    return firstValueFrom(this.authService.register(dto).pipe(retryWithBackoff(this.retryOptions)));
  }

  // =====================================================
  // PRODUCT SERVICE
  // =====================================================

  @Public()
  @Get('products')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get all active products' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAllProducts() {
    return firstValueFrom(this.productService.findAll({}));
  }

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
  // ORDER SERVICE
  // =====================================================

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Orders')
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user.id;

    return firstValueFrom(this.orderService.createOrder({ ...dto, userId }));
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Orders')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async getOrders(@Req() req: any) {
    const userId = req.user.id;

    return firstValueFrom(this.orderService.getUserOrders({ userId, page: 1, pageSize: 20 }));
  }
}
