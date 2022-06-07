import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "controllers/order.controller";
import { ProductController } from "controllers/product.controller";
import { Order, OrderSchema } from "schemas/order.schema";
import { Product, ProductSchema } from "schemas/product.schema";
import { OrderService } from "services/order.service";
import { ProductService } from "services/product.service";
import { ProductModule } from "./product.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      }
    ])
  ],
  controllers: [OrderController, ProductController],
  providers: [OrderService, ProductService],
})
export class OrderModule {}
