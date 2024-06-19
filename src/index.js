import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { databaseConnection } from "./utils/database.js";
import { logger } from "./utils/logger.js";
import auth from "./modules/auth/route.js";
import { respond } from "./utils/response.js";
import { globalErrorHandler, routeNotFoundHandler } from "./middlewares/error.js";
import admin from "./modules/admin/route.js";
import profile from "./modules/profile/route.js";
import product from "./modules/product/route.js";
import category from "./modules/category/route.js";
import rating from "./modules/rating/route.js";
import review from "./modules/review/route.js";
import cart from "./modules/cart/route.js";

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
  return respond(res, 200, "Ecommerce  API is running..")
})

app.use('/v1/auth', auth);
app.use('/v1/admin/users', admin)
app.use('/v1/profile', profile)
app.use('/v1/category', category)
app.use('/v1/products', product)
app.use('/v1/rating', rating)
app.use('/v1/review', review)
app.use('/v1/cart', cart)

app.use(routeNotFoundHandler);
app.use(globalErrorHandler)


app.listen(port, () => {
  logger.info(`Server is running on  port ${port}`);
});
