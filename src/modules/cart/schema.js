import Joi from "joi"

export const addToCartSchema = Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().required()
})

export const updateCartSchema = Joi.object({
    quantity: Joi.number().required()
})