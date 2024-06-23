import Joi from "joi";

export const createOrderSchema = Joi.object({
  shippingDetails: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

export const updateOrderSchema = Joi.object({
  shippingDetails: Joi.object({
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
});

export const fetchOrderSchema = Joi.object({
    orderId: Joi.string().uuid().required()
})
