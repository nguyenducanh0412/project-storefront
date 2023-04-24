import { BaseProduct, Product } from "../interfaces/IProduct";
import Client from "../config/db";
import { IRepository } from "../interfaces/IRepository";

const TABLE_NAME = "products";

export class ProductService implements IRepository<Product> {
  async getAll(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const querySQL = `SELECT * FROM ${TABLE_NAME}`;

      const result = await conn.query(querySQL);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getDetail(id: number): Promise<Product> {
    try {
      const querySQL = `SELECT * FROM ${TABLE_NAME} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async create(item: BaseProduct): Promise<Product> {
    const { name, price } = item;

    try {
      const querySQL = `INSERT INTO ${TABLE_NAME} (name, price) VALUES($1, $2) RETURNING *`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [name, price]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async update(id: number, item: BaseProduct): Promise<Product> {
    const { name: newProductName, price } = item;

    try {
      const querySQL = `UPDATE ${TABLE_NAME} SET name = $1, price = $2 WHERE id = $3 RETURNING *`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [newProductName, price, id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async delete(id: number): Promise<Product> {
    try {
      const querySQL = `DELETE FROM ${TABLE_NAME} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
