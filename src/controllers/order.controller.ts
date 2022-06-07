import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateOrderDto } from "dto/create-order.dto";
import { UpdateOrderDto } from "dto/update-order.dto";
import { ObjectId } from "mongoose";
import { Order } from "schemas/order.schema";
import { OrderService } from "services/order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  public async create(
    @Body() body: CreateOrderDto
  ): Promise<{ response: string; order: Order }> {
    const order = await this.orderService.create(body);

    return { response: "Pedido criado.", order: order };
  }

  @Get()
  public async findAll(): Promise<{ response: Order[] }> {
    const allOrders = await this.orderService.findAll();

    return { response: allOrders };
  }

  @Get(":id")
  public async findById(
    @Param("id") id: ObjectId
  ): Promise<{ response: Order }> {
    const foundOrder = await this.orderService.findById(id);

    return { response: foundOrder };
  }

  @Patch(":id/:product")
  public async update(
    @Param("id") id: ObjectId,
    @Param("product", ParseIntPipe) product: number,
    @Body() body: UpdateOrderDto
  ): Promise<{ response: string }> {
    await this.orderService.update(id, product, body);

    return { response: "Pedido atualizado." };
  }

  @Delete(":id")
  public async remove(
    @Param("id") id: ObjectId
  ): Promise<{ response: string }> {
    await this.orderService.remove(id);

    return { response: `Pedido ${id} removido.` };
  }
}
