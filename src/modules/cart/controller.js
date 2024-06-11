import { respond } from "../../utils/response";
import repository from "./repository";
import { addToCartSchema } from "./schema";

async function addToCart(req, res, next) {
  try {
    const validatedData = await addToCartSchema.validateAsync(req.params);
    const cartItem = await repository.create(req.userId, validatedData);
    return respond(res, 201, "Item added to cart succesfully", {
      cart: cartItem,
    });
  } catch (err) {
    next(err);
  }
}

async function viewCart(req, res, next) {
  try {
    const existingCart = await repository.fetchCart(req.userId);
    if (!existingCart) return respond(res, 404, "Cart does not exist");
    return respond(res, 200, "Cart retrieved successfully", {
      cart: existingCart,
    });
  } catch (err) {
    next(err);
  }
}

async function removeItemFromCart(req, res, next) {
  try {
    const existingCart = await repository.fetchCart(req.userId);
    if (!existingCart) return respond(res, 404, "Cart does not exist");
  } catch (err) {
    next(err);
  }
}
