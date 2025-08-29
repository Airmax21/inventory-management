import { Router } from "express";
import userRouter from "@api/v1/users/users.router";
import masterRouter from "@api/v1/masters/master.router";
import categoryRouter from "@api/v1/categories/category.router";
import locationRouter from "@api/v1/locations/location.router";
import itemRouter from "@api/v1/items/item.router";
import transactionRouter from "@api/v1/transactions/transaction.router";
import backupRouter from "@api/v1/backup/backup.router";
import restoreRouter from "@api/v1/restore/restore.router";

const v1Router = Router();

v1Router.use('/user', userRouter)
v1Router.use('/master', masterRouter)
v1Router.use('/category',categoryRouter)
v1Router.use('/location', locationRouter)
v1Router.use('/item', itemRouter)
v1Router.use('/transaction', transactionRouter)
v1Router.use('/backup', backupRouter)
v1Router.use('/restore', restoreRouter)

export default v1Router;