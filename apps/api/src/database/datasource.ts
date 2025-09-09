import "reflect-metadata";
import 'dotenv/config';
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Master } from "./entity/master.entity";
import { Item } from "./entity/item.entity";
import { Category } from "./entity/category.entity";
import { Location } from "./entity/location.entity";
import { Transaction } from "./entity/transaction.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.MODE === 'dev' ? true : false,
    logging: false,
    entities: [
        User,
        Item,
        Master,
        Category,
        Location,
        Transaction
    ],
    migrations: [__dirname + "/migrations/**/*.js"],
    subscribers: [],
});