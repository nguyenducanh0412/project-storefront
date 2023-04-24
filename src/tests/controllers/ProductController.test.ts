import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";
import app from "../../server";
import { BaseProduct } from "../../interfaces/IProduct";
import { BaseAuthUser } from "../../interfaces/IUser";

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe("Tesing for product controller", () => {
  const product: BaseProduct = {
    name: "Milk Cow",
    price: 3030,
  };

  let token: string, userId: number, productId: number;

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      username: "ducanhnguyen",
      firstname: "Duc Anh",
      lastname: "Nguyen",
      password: "12345678",
    };

    const { body } = await request.post("/users/create").send(userData);

    token = body;

    const { user } = jwt.verify(token, SECRET) as any;
    userId = user.id;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set("Authorization", "bearer " + token);
  });

  it("test for function create product", (done) => {
    request
      .post("/products/create")
      .send(product)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(200);

        productId = body.id;

        done();
      });
  });

  it("test for function get all product", (done) => {
    request.get("/products").then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("test for function get detail product", (done) => {
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("test for function update product", (done) => {
    const newProductData: BaseProduct = {
      ...product,
      name: "Milk",
      price: 1299,
    };

    request
      .put(`/products/${productId}`)
      .send(newProductData)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });

  it("test for function delete product", (done) => {
    request
      .delete(`/products/${productId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
