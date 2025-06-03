import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from "path";

const rootDir = path.join(__dirname, "..");

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [path.join(rootDir, "entities/**/*.{js,ts}")],
    migrations: [path.join(rootDir, "migrations/**/*.{js,ts}")],
    subscribers: [],
    namingStrategy: new SnakeNamingStrategy(),
}); 