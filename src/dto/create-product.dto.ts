import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  qty_stock: number;
}
