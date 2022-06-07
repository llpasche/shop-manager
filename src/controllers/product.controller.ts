import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { CreateProductDto } from "dto/create-product.dto";
import { UpdateProductDto } from "dto/update-product.dto";
import { Product } from "schemas/product.schema";
import { ProductService } from "services/product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  public async create(@Body() body: CreateProductDto): Promise<{response: string, product: Product}> {
    const product = await this.productService.create(body);

    return {response: "Produto cadastrado.", product: product}
  }

  @Get()
  public async findAll(): Promise<{response: Product[]}> {
    const allProducts = await this.productService.findAll();

    return {response: allProducts}
  }

  @Get(":id")
  public async findById(@Param("id", ParseIntPipe) id: number): Promise<{response: Product}> {
    const foundProduct = await this.productService.findById(id);

    return {response: foundProduct};
  }

  @Put(":id")
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto
  ): Promise<{ response: string }> {
    await this.productService.update(id, body);

    return { response: `Produto #${id} atualizado.` };
  }

  @Delete(":id")
  public async remove(@Param("id", ParseIntPipe) id: number): Promise<{response: string}> {
    await this.productService.remove(id);

    return {response: `Produto ${id} removido.`}
  }
}
