import Joi from "joi";

export const createPaymentSchema = Joi.object({
  email: Joi.string().email().required(),
  amount: Joi.number().required(),
});

export const verifyPaymentSchema = Joi.object({
  refrence: Joi.string().required(),
});
