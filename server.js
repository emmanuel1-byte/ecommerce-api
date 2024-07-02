import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { databaseConnection } from "./src/utils/database.js";
import { logger } from "./src/utils/logger.js";
import auth from "./src/modules/auth/route.js";
import { respond } from "./src/utils/response.js";
import { globalErrorHandler, routeNotFoundHandler } from "./src/middlewares/error.js";
import admin from "./src/modules/admin/route.js";
import profile from "./src/modules/profile/route.js";
import product from "./src/modules/product/route.js";
import category from "./src/modules/category/route.js";
import rating from "./src/modules/rating/route.js";
import review from "./src/modules/review/route.js";
import cart from "./src/modules/cart/route.js";
import order from "./src/modules/order/route.js";
import payment from "./src/modules/payment/route.js";
import dashBoard from "./src/modules/dashboard/route.js";

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
app.use('/v1/profiles', profile)
app.use('/v1/category', category)
app.use('/v1/products', product)
app.use('/v1/ratings', rating)
app.use('/v1/reviews', review)
app.use('/v1/carts', cart)
app.use('/v1/orders', order)
app.use('/v1/payments', payment)
app.use('/v1/dashboards', dashBoard)

app.use(routeNotFoundHandler);
app.use(globalErrorHandler)


app.listen(port, () => {
  logger.info(`Server is running on  port ${port}`);
});
