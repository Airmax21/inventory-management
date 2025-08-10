import { Router } from "express";
import userRouter from "@api/v1/users/users.router";
import masterRouter from "@api/v1/masters/master.router";
import categoryRouter from "@api/v1/categories/category.router";
import locationRouter from "@api/v1/locations/location.router";

const v1Router = Router();

v1Router.use('/user', userRouter)
v1Router.use('/master', masterRouter)
v1Router.use('/category',categoryRouter)
v1Router.use('/location', locationRouter)

export default v1Router;