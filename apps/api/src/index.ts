import dotenv from 'dotenv';
dotenv.config();

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "@database/datasource";
import v1Router from '@api/v1/v1.router';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.config';

AppDataSource.initialize().then(async () => {
    const app = express();
    app.use(express.json());

    app.use("/api/docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    app.use("/api/v1", v1Router);

    app.listen(process.env.APP_PORT || 3000, () => {
        console.log("Server Express telah berjalan di port 3000");
    });
}).catch(error => console.log(error));