import { Router } from "express";
import userRouter from "@api/v1/users/users.router";

const v1Router = Router();

v1Router.use('/user', userRouter)

export default v1Router;