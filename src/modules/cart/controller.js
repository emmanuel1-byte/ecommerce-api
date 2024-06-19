import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import productRepository from "../product/repository.js";
import {
  addToCartSchema,
  fetchCartSchema,
  fetchProductSchema,
} from "./schema.js";


/**
 * Creates a new cart for the authenticated user and adds the specified product to it.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.productId - The ID of the product to add to the cart.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function createCart(req, res, next) {
  try {
    const params = await addToCartSchema.validateAsync(req.params);
    const existingProduct = await productRepository.fetchProductById(
      params.productId
    );
    if (!existingProduct)
      return respond(res, 404, "Error adding item to cart: Product not found");
    const newCart = await repository.create(req.userId, params.productId);
    return respond(res, 201, "Cart created succesfully", { cart: newCart });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the existing cart for the authenticated user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.userId - The ID of the authenticated user.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
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

/**
 * Increases the product quantity in the specified cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.cartId - The ID of the cart.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function increaseProductQuantity(req, res, next) {
  try {
    const params = await fetchCartSchema.validateAsync(req.params);
    const existingCart = await repository.fetchCartById(params.cartId);
    if (!existingCart) return respond(res, 404, "Cart not found");
    await repository.increaseQuantity(existingCart.id);
    return respond(res, 200, "Quantity increased succesfully");
  } catch (err) {
    next(err);
  }
}

/**
 * Decreases the product quantity in the specified cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.cartId - The ID of the cart.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function decreaseProductQuantity(req, res, next) {
  try {
    const params = await fetchCartSchema.validateAsync(req.params);
    const existingCart = await repository.fetchCartById(params.cartId);
    if (!existingCart) return respond(res, 404, "Cart not found");
    await repository.decreaseQuantity(existingCart.id);
    return respond(res, 200, "Quantity decreased succesfully");
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a product from the specified cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.productId - The ID of the product to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function deleteProductFromCart(req, res, next) {
  try {
    const params = await fetchProductSchema.validateAsync(req.params);
    const existingProduct = await repository.deleteFromCart(params.productId);
    if (!existingProduct) return respond(res, 404, "Product not found");
    return respond(res, 200, "Product deleted from cart successfully");
  } catch (err) {
    next(err);
  }
}
