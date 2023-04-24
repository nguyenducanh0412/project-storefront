import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";
import app from "../../server";
import { BaseOrder } from "../../interfaces/IOrder";
import { BaseProduct } from "../../interfaces/IProduct";
import { BaseAuthUser } from "../../interfaces/IUser";

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe("Tesing for order controller", () => {
  let token: string,
    order: BaseOrder,
    user_id: number,
    product_id: number,
    order_id: number;

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      firstname: "Duc Anh",
      lastname: "Nguyen",
      username: "ducanhnguyen",
      password: "12345678",
    };
    const productData: BaseProduct = {
      name: "Milk Cow",
      price: 3030,
    };

    const { body: userBody } = await request
      .post("/users/create")
      .send(userData);

    token = userBody;

    const { user } = jwt.verify(token, SECRET) as any;
    user_id = user.id;

    const { body: productBody } = await request
      .post("/products/create")
      .set("Authorization", "bearer " + token)
      .send(productData);
    product_id = productBody.id;

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
    await request
      .delete(`/users/${user_id}`)
      .set("Authorization", "bearer " + token);
    await request
      .delete(`/products/${product_id}`)
      .set("Authorization", "bearer " + token);
  });

  it("test for function create order", (done) => {
    request
      .post("/orders/create")
      .send(order)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(200);

        order_id = body.id;

        done();
      });
  });

  it("test for function get all order", (done) => {
    request
      .get("/orders")
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("test for function get detail order", (done) => {
    request
      .get(`/orders/${order_id}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("test for function update order", (done) => {
    const newOrder: BaseOrder = {
      ...order,
      status: false,
    };

    request
      .put(`/orders/${order_id}`)
      .send(newOrder)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });

  it("test for function delete order", (done) => {
    request
      .delete(`/orders/${order_id}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
