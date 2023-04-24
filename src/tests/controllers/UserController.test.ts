import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";

import app from "../../server";
import { BaseAuthUser } from "../../interfaces/IUser";

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe("Tesing for user controller", () => {
  const userData: BaseAuthUser = {
    username: "ducanhnguyen",
    firstname: "Duc Anh",
    lastname: "Nguyen",
    password: "12345678",
  };

  let token: string,
    userId: number = 3;

  it("test for function create user", (done) => {
    request
      .post("/users/create")
      .send(userData)
      .then((res) => {
        const { body, status } = res;
        token = body;
        const { user } = jwt.verify(token, SECRET) as any;
        userId = user.id;

        expect(status).toBe(200);
        done();
      });
  });

  it("test for function get all user", (done) => {
    request
      .get("/users")
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("test for function get detail user", (done) => {
    request
      .get(`/users/${userId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("test for function update user", (done) => {
    const newUserData: BaseAuthUser = {
      ...userData,
      firstname: "Duc Anh 2",
      lastname: "Nguyen",
    };

    request
      .put(`/users/${userId}`)
      .send(newUserData)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });

  it("test for function get token authorization", (done) => {
    request
      .post("/users/auth")
      .send({
        username: userData.username,
        password: userData.password,
      })
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("test for function get token authorization with wrong password", (done) => {
    request
      .post("/users/auth")
      .send({
        username: userData.username,
        password: "12345678@",
      })
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      });
  });

  it("test for function delete user", (done) => {
    request
      .delete(`/users/${userId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
