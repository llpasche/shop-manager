import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "schemas/product.schema";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);

    await createdProduct.save();

    return createdProduct;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  public async findById(id: number): Promise<Product> {
    const [foundProduct] = await this.productModel.find({ product_id: id });
    if (!foundProduct) {
      throw new NotFoundException("Produto não encontrado.");
    }
    return foundProduct;
  }

  public async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<void> {
    const foundProduct = await this.findById(id);
    if (!foundProduct) {
      throw new NotFoundException("Produto não encontrado.");
    }

    await this.productModel.updateOne({ product_id: id }, updateProductDto);
  }

  public async remove(id: number): Promise<void> {
    const foundProduct = await this.findById(id);
    if (!foundProduct) {
      throw new NotFoundException("Produto não encontrado.");
    }

    await this.productModel.deleteOne({ product_id: id });
  }
}
