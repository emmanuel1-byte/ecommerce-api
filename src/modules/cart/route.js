import express from "express";
import { validateJwt } from "../../middlewares/auth.js";
import {
  createCart,
  decreaseProductQuantity,
  increaseProductQuantity,
  viewCart,
} from "./controller.js";
const cart = express.Router();

cart.post("/", validateJwt, createCart);

cart.get("/", validateJwt, viewCart);

cart.patch("/increase-quantity/:cartId", validateJwt, increaseProductQuantity);

cart.patch("/decrease-quantity/:cartId", validateJwt, decreaseProductQuantity);

// cart.delete('/:cartId', validateJwt)

export default cart;
