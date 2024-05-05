import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import Joi from "joi";
import { databaseConnection } from "./utils/database.js";
import { logger } from "./utils/logger.js";
import auth from "./modules/auth/route.js";
import { respond } from "./utils/response.js";

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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ecommerce API service is running...",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint does not exist on this server",
  });
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;
  if (err instanceof Joi.ValidationError) {
    return respond(res, 400, false, err.message);
  }
  return respond(res, statusCode, false, "Internal Server Error");
});

app.listen(port, () => {
  logger.info(`Server is running on  port ${port}`);
});
