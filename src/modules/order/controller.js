import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import {
  createOrderSchema,
  fetchOrderSchema,
  updateOrderSchema,
} from "./schema.js";

/**
 * Creates a new order.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the new order data.
 * @param {string} req.userId - The ID of the user creating the order.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the order has been created.
 */
export async function createOrder(req, res, next) {
  try {
    const validatedData = await createOrderSchema.validateAsync(req.body);
    const newOrder = await repository.create(req.userId, validatedData);
    return respond(res, 201, "Order created successfully", { order: newOrder });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves an existing order by its ID.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.orderId - The ID of the order to retrieve.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the order has been retrieved.
 */
export async function getOrder(req, res, next) {
  try {
    const params = await fetchOrderSchema.validateAsync(req.params);
    const existingOrder = await repository.fetchOrderById(params.orderId);
    if (!existingOrder) return respond(res, 404, "Order not found");
    return respond(res, 200, "Order found", { order: existingOrder });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a list of orders for the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {string} req.userId - The ID of the authenticated user.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the orders have been retrieved.
 */
export async function listOrder(req, res, next) {
  try {
    const order = await repository.fetchOrder(req.userId);
    return respond(res, 200, "Order retrieved succesfully", { order });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates an existing order.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the updated order data.
 * @param {string} req.userId - The ID of the user making the update.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the order has been updated.
 */
export async function updateOrder(req, res, next) {
  try {
    const validatedData = await updateOrderSchema.validateAsync(req.body);
    const updatedOrder = await repository.updateOrder(
      req.userId,
      validatedData
    );
    return respond(res, 200, "Order updated succesfully", {
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
}
