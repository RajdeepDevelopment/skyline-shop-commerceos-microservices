import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductServiceService } from './product-service.service';

@Controller()
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @GrpcMethod('ProductService', 'Create')
  create(data: any) {
    return this.productServiceService.create(data);
  }

  @GrpcMethod('ProductService', 'FindAll')
  async findAll() {
    const products = await this.productServiceService.findAll();
    return { products };
  }

  @GrpcMethod('ProductService', 'FindOne')
  findOne(data: { id: string }) {
    return this.productServiceService.findOne(data.id);
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
