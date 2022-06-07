import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

export type productAtOrderConverted = {
  product: string;
  quantity: number
}

@Schema()
export class Order {
  @Prop()
  customer: string;

  @Prop()
  delivery_date: string;

  @Prop()
  shop_list: productAtOrderConverted[];

  @Prop()
  order_price: number
}

export const OrderSchema = SchemaFactory.createForClass(Order);
