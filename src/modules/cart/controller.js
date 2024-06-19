import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import { addToCartSchema, findCartSchema } from "./schema.js";

/**
 * Creates a new cart for the authenticated user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the cart data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function createCart(req, res, next) {
  try {
    const validatedData = await addToCartSchema.validateAsync(req.body);
    const newCart = await repository.create(req.userId, validatedData);
    return respond(res, 201, "Cart created succesfully", { cart: newCart });
  } catch (err) {
    next(err);
  }
}

export async function viewCart(req, res, next) {
  try {
    const existingCart = await repository.fetchCart(req.userId);
    if (!existingCart) return respond(res, 404, "Cart does not exist");
    return respond(res, 200, "Cart retrieved successfully", {
      cart: existingCart.cart,
      subtotal: existingCart.subtotal,
    });
  } catch (err) {
    next(err);
  }
}

export async function increaseProductQuantity(req, res, next) {
  try {
    const params = await findCartSchema.validateAsync(req.params);
    const existingCart = await repository.fetchCartById(params.cartId);
    if (!existingCart) return respond(res, 404, "Cart not found");
    await repository.increaseQuantity(existingCart.id);
    return respond(res, 200, "Quantity increased succesfully");
  } catch (err) {
    next(err);
  }
}

export async function decreaseProductQuantity(req, res, next) {
  try {
    const params = await findCartSchema.validateAsync(req.params);
    const existingCart = await repository.fetchCartById(params.cartId);
    if (!existingCart) return respond(res, 404, "Cart not found");
    await repository.decreaseQuantity(existingCart.id);
    return respond(res, 200, "Quantity decreased succesfully");
  } catch (err) {
    next(err);
  }
}

export async function deleteCart(req, res, next) {
  try {
    const existingCart = await repository.fetchCart(req.userId);
    if (!existingCart) return respond(res, 404, "Cart does not exist");
  } catch (err) {
    next(err);
  }
}
