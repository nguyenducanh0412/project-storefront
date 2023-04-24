import { BaseOrder, Order } from "../interfaces/IOrder";
import Client from "../config/db";
import { IRepository } from "../interfaces/IRepository";

const TABLE_NAME = "orders";

export class OrderService implements IRepository<Order> {
  async getDetail(id: number): Promise<Order> {
    try {
      const sql = `SELECT * FROM ${TABLE_NAME} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];

      const orderProductsSql =
        "SELECT product_id, quantity FROM order_products WHERE order_id=($1)";
      const { rows: orderProductRows } = await conn.query(orderProductsSql, [
        id,
      ]);

      conn.release();

      return {
        ...order,
        products: orderProductRows,
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getAll(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM ${TABLE_NAME}`;

      const result = await conn.query(sql);

      const orderProductsSql =
        "SELECT product_id, quantity FROM order_products WHERE order_id=($1)";
      const orders = [];

      for (const order of result.rows) {
        const { rows: orderProductRows } = await conn.query(orderProductsSql, [
          order.id,
        ]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async create(item: BaseOrder): Promise<Order> {
    const { products, status, user_id } = item;

    try {
      const sql = `INSERT INTO ${TABLE_NAME} (user_id, status) VALUES($1, $2) RETURNING *`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [user_id, status]);
      const order = result.rows[0];

      const queryOrder =
        "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity";
      const orderProducts = [];

      for (const product of products) {
        const { product_id, quantity } = product;

        const result = await conn.query(queryOrder, [
          order.id,
          product_id,
          quantity,
        ]);

        orderProducts.push(result.rows[0]);
      }

      conn.release();

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async update(id: number, item: BaseOrder): Promise<Order> {
    const { products, status } = item;

    try {
      const sql = `UPDATE ${TABLE_NAME} SET status = $1 WHERE id = $2 RETURNING *`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [status, id]);
      const order = result.rows[0];

      const orderProductsSql =
        "UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity";
      const orderProducts = [];

      for (const product of products) {
        const { product_id, quantity } = product;

        const result = await conn.query(orderProductsSql, [
          product_id,
          quantity,
          order.id,
        ]);
        orderProducts.push(result.rows[0]);
      }

      conn.release();

      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async delete(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const orderProductsSql = "DELETE FROM order_products WHERE order_id=($1)";
      await conn.query(orderProductsSql, [id]);

      const sql = `DELETE FROM ${TABLE_NAME} WHERE id=($1)`;
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
