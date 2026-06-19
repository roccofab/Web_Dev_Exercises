import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASS);
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME,
  

  synchronize: true,
  logging: false,

  entities: [__dirname + "/../entities/*.{ts,js}"]

});

console.log("DB USER:", process.env.DB_USER);
console.log("DB PASS:", process.env.DB_PASS);