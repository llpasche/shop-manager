import { Module } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'schemas/product.schema';
import { ProductController } from 'controllers/product.controller';

@Module({
  imports:[MongooseModule.forFeature([{
    name: Product.name, schema: ProductSchema
  }])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
