import { PayStack } from "../../services/payment/paystack.js";
import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import orderRepository from "../order/repository.js";
import productRepository from "../product/repository.js";

import { createPaymentSchema, verifyPaymentSchema } from "./schema.js";

/**
 * Initiates a payment transaction using the PayStack payment gateway.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the payment details.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Redirects the user to the PayStack payment page.
 */
export async function makePayment(req, res, next) {
  try {
    const validatedData = await createPaymentSchema.validateAsync(req.body);
    const initiatePayment = await PayStack.createTransaction(validatedData);
    await repository.create(req.userId, validatedData);
    res.redirect(initiatePayment);
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const params = await verifyPaymentSchema.validateAsync(req.params);
    const verifyPayment = await PayStack.verifyTransaction(params.refrence);
    await orderRepository.updateOrderStatus(req.userId, "processing");
    await productRepository.deleteProductById;
    return respond(
      res,
      verifyPayment.statusCode,
      verifyPayment.message,
      verifyPayment.data
    );
  } catch (err) {
    next(err);
  }
}
