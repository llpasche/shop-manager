import { IsArray, IsNotEmpty, IsString } from "class-validator";
export type productAtOrder = {
    productId: number;
    productQuantity: number
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    customer: string

    @IsString()
    @IsNotEmpty()
    delivery_date: string

    @IsArray()
    @IsNotEmpty()
    shop_list: productAtOrder[]

}