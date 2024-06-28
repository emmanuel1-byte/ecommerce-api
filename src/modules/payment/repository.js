import { logger } from "../../utils/logger.js";
import { Payment } from "./model.js";

/**
 * Creates a new payment record in the database.
 *
 * @param {string} userId - The ID of the user associated with the payment.
 * @param {object} data - An object containing the payment details.
 * @param {string} data.email - The email address associated with the payment.
 * @param {number} data.amount - The amount of the payment.
 * @returns {Promise<Payment>} - A Promise that resolves to the created payment record.
 */
async function create(userId, data) {
  try {
    return await Payment.create({
      email: data.email,
      amount: data.amount,
      user_id: userId,
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
    create
}

export default repository;
