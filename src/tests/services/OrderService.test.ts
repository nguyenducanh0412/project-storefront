import { BaseOrder, Order } from "../../interfaces/IOrder";
import { Product } from "../../interfaces/IProduct";
import { User } from "../../interfaces/IUser";
import { OrderService } from "../../services/OrderService";
import { ProductService } from "../../services/ProductService";
import { UserService } from "../../services/UserService";

const orderService = new OrderService();
const userService = new UserService();
const productService = new ProductService();

describe("testing for order service", () => {
  let order: BaseOrder;
  let user_id: number;
  let product_id: number;

  async function createOrder(orderPrams: BaseOrder) {
    return orderService.create(orderPrams);
  }

  async function deleteOrder(id: number) {
    return orderService.delete(id);
  }

  beforeAll(async () => {
    const user: User = await userService.create({
      username: "ducanhnguyen",
      firstname: "Duc Anh",
      lastname: "Nguyen",
      password: "12345678",
    });

    user_id = user.id;

    const product: Product = await productService.create({
      name: "Product test",
      price: 69,
    });

    product_id = product.id;

    order = {
      products: [
        {
          product_id,
          quantity: 5,
        },
      ],
      user_id,
      status: true,
    };
  });

  afterAll(async () => {
    await userService.delete(user_id);
    await productService.delete(product_id);
  });

  it("testing for create order", async () => {
    const createdOrder: Order = await createOrder(order);

    expect(createdOrder).toEqual({
      id: createdOrder.id,
      ...order,
    });

    await deleteOrder(createdOrder.id);
  });

  it("testing for create, get detail, delete order", async () => {
    const createdOrder: Order = await createOrder(order);
    const orderFromDb = await orderService.getDetail(createdOrder.id);

    expect(orderFromDb).toEqual(createdOrder);

    await deleteOrder(createdOrder.id);
  });

  it("testing for create and update order", async () => {
    const createdOrder: Order = await createOrder(order);
    const newOrderData: BaseOrder = {
      products: [
        {
          product_id,
          quantity: 200,
        },
      ],
      user_id,
      status: false,
    };

    const { products, status } = await orderService.update(
      createdOrder.id,
      newOrderData
    );

    expect(products).toEqual(newOrderData.products);
    expect(status).toEqual(newOrderData.status);

    await deleteOrder(createdOrder.id);
  });
});
