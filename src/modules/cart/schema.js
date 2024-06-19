import Joi from "joi"

export const addToCartSchema = Joi.object({
    productId: Joi.string().uuid().required(),
})

export const updateCartSchema = Joi.object({
    quantity: Joi.number().required()
})

export const fetchCartSchema = Joi.object({
    cartId: Joi.string().uuid().required()
})

export const fetchProductSchema = Joi.object({
    productId: Joi.string().uuid().required()
})