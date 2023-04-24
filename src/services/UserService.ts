import bcrypt from "bcrypt";
import Client from "../config/db";
import { IRepository } from "../interfaces/IRepository";
import { BaseAuthUser, BaseUser, User } from "../interfaces/IUser";

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

const TABLE_NAME = "users";

export class UserService implements IRepository<User> {
  async getAll(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const querySQL: string = `SELECT * FROM ${TABLE_NAME}`;

      const result = await conn.query(querySQL);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getDetail(id: number): Promise<User> {
    try {
      const querySQL: string = `SELECT * FROM ${TABLE_NAME} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const querySQL: string = `DELETE FROM ${TABLE_NAME} WHERE id=($1)`;
      const conn = await Client.connect();

      await conn.query(querySQL, [id]);

      conn.release();

      return id as any;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async create(user: BaseAuthUser): Promise<User> {
    const { firstname, lastname, username, password } = user;

    try {
      const querySQL: string = `INSERT INTO ${TABLE_NAME} (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *`;
      const hash = bcrypt.hashSync(
        password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string, 10)
      );
      const conn = await Client.connect();
      const values = [firstname, lastname, username, hash];
      const result = await conn.query(querySQL, values);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async update(id: number, newUserData: BaseUser): Promise<User> {
    const { firstname, lastname } = newUserData;

    try {
      const querySQL: string = `UPDATE ${TABLE_NAME} SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *`;
      const conn = await Client.connect();
      const values = [firstname, lastname, id];
      const result = await conn.query(querySQL, values);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const querySQL: string = `SELECT * FROM ${TABLE_NAME} WHERE username=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(querySQL, [username]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const compareSync = bcrypt.compareSync(
          password + BCRYPT_PASSWORD,
          user.password_digest
        );
        if (compareSync) {
          return user;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
