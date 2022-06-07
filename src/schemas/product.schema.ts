import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop(Number)
  product_id: number;

  @Prop(String)
  name: string;

  @Prop(Number)
  price: number;

  @Prop(Number)
  qty_stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
