import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}