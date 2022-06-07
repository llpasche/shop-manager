import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderModule } from "modules/order.module";
import { ProductModule } from "./modules/product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
    OrderModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class AppModule {}
