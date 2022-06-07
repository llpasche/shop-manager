import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateOrderDto } from "dto/create-order.dto";
import { UpdateOrderDto } from "dto/update-order.dto";
import { Model, ObjectId } from "mongoose";
import {
  Order,
  OrderDocument,
  productAtOrderConverted,
} from "schemas/order.schema";
import { Product, ProductDocument } from "schemas/product.schema";
import { ProductService } from "./product.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private productService: ProductService
  ) {}

  public async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const shopList = [];
    let price: number = 0;
    for (let product of createOrderDto.shop_list) {
      const foundProduct = await this.productModel.findOne({
        product_id: product.productId,
      });

      if (!foundProduct) {
        throw new NotFoundException(
          `Produto #${product.productId} não encontrado`
        );
      }

      if (product.productQuantity > foundProduct.qty_stock) {
        throw new NotAcceptableException("Quantidade indisponível.");
      }

      const orderInput: productAtOrderConverted = {
        product: foundProduct.name,
        quantity: product.productQuantity,
      };

      shopList.push(orderInput);
      price += foundProduct.price * product.productQuantity;

      await this.productModel.updateOne(
        { product_id: product.productId },
        { qty_stock: foundProduct.qty_stock - product.productQuantity }
      );
    }
    const formattedInput = {
      ...createOrderDto,
      shop_list: shopList,
      order_price: price.toFixed(2),
    };
    const createdOrder = new this.orderModel(formattedInput);

    await createdOrder.save();

    return createdOrder;
  }

  public async findAll(): Promise<Order[]> {
    const allOrders = await this.orderModel.find().exec();
    return allOrders;
  }

  public async findById(id: ObjectId): Promise<Order> {
    const foundOrder = await this.orderModel.findOne({ _id: id });
    if (!foundOrder) {
      throw new NotFoundException("Pedido não encontrado.");
    }
    return foundOrder;
  }

  public async update(
    orderId: ObjectId,
    productId: number,
    quantity: UpdateOrderDto
  ) {
    const [foundOrder, foundProduct] = await Promise.all([
      await this.orderModel.findOne({ _id: orderId }),
      await this.productService.findById(productId),
    ]);
    if (!foundOrder) {
      throw new NotFoundException("Pedido não encontrado.");
    }

    for (let product of foundOrder.shop_list) {
      if (product.product === foundProduct.name) {
        const quantityDifference = quantity.quantity - product.quantity;
        const updateOrderPrice = async (): Promise<void> => {
          foundOrder.order_price += quantityDifference * foundProduct.price;
        };

        if (quantity.quantity > foundProduct.qty_stock) {
          throw new NotAcceptableException("Quantidade indisponível.");
        }

        if (quantity.quantity < 0) {
          throw new NotAcceptableException("Insira um valor válido.");
        }

        if (quantity.quantity === 0) {
          const productIndex = foundOrder.shop_list.indexOf(product);
          foundOrder.shop_list.splice(productIndex, 1);
          updateOrderPrice();

          break;
        }
        product.quantity = quantity.quantity;

        updateOrderPrice();

        if (quantityDifference !== 0) {
          await this.productModel.updateOne(
            { product_id: foundProduct.product_id },
            { qty_stock: foundProduct.qty_stock - quantityDifference }
          );

        } else {
          throw new UnprocessableEntityException(
            "Insira um valor diferente para atualizar seu pedido."
          );
        }
      }
    }

    // TODO: MENSAGEM DE ERRO AO ATUALIZAR QUANTIDADE DE PRODUTO QUE NÃO PERTENCE AO PEDIDO
    if (foundOrder.shop_list.length === 0) {
      this.remove(foundOrder._id);
    }
    await this.orderModel.updateOne({ _id: orderId }, foundOrder);
  }

  public async remove(orderId: ObjectId): Promise<void> {
    const foundOrder = await this.orderModel.findOne({ _id: orderId });
    if (!foundOrder) {
      throw new NotFoundException("Pedido não encontrado.");
    }

    await this.orderModel.deleteOne({ _id: orderId });
  }
}
