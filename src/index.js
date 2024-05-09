import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import Joi from "joi";
import { databaseConnection } from "./utils/database.js";
import { logger } from "./utils/logger.js";
import auth from "./modules/auth/route.js";
import { respond } from "./utils/response.js";
import { globalErrorHandler, routeNotFound } from "./middlewares/error.js";

const app = express();
const port = process.env.PORT || 3000;

databaseConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({ methods: ["POST", "PUT", "DELETE", "GET", "PATCH"], origin: "*" })
);
app.use(helmet());

app.use("/v1/auth", auth);

app.use(routeNotFound);
app.use(globalErrorHandler)


app.listen(port, () => {
  logger.info(`Server is running on  port ${port}`);
});
