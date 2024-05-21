import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { databaseConnection } from "./utils/database.js";
import { logger } from "./utils/logger.js";
import auth from "./modules/auth/route.js";
import { respond } from "./utils/response.js";
import { globalErrorHandler, routeNotFound } from "./middlewares/error.js";
import admin from "./modules/admin/route.js";
import profile from "./modules/profile/route.js";

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


app.get('/', (req, res)=>{
  return respond(res, 200, "Welcome to the API")
})

app.use("/v1/auth", auth);
app.use("/v1/admin/users", admin)
app.use('/v1/profile', profile)

app.use(routeNotFound);
app.use(globalErrorHandler)


app.listen(port, () => {
  logger.info(`Server is running on  port ${port}`);
});
