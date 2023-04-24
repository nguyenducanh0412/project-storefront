import dotenv from "dotenv";
import { ClientConfig, Pool } from "pg";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PORT_TEST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;

const config: ClientConfig = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as unknown as number,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
};

if (ENV === "test") {
  config.database = POSTGRES_DB_TEST;
}

console.log(ENV);

export default new Pool(config);
