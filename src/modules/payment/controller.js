import { PayStack } from "../../services/payment/paystack.js";
import { respond } from "../../utils/response.js";

import { createPaymentSchema, verifyPaymentSchema } from "./schema.js";

export async function makePayment(req, res, next) {
  try {
    const validatedData = await createPaymentSchema.validateAsync(req.body);
    const initiatePayment = await PayStack.createTransaction(validatedData);
    // res.redirect(initiatePayment);
    res.status(200).json({
        message: "Payment successful",
        data: initiatePayment
    })
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const params = await verifyPaymentSchema.validateAsync(req.params);
    const verifyPayment = await PayStack.verifyTransaction(params.refrence);
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
