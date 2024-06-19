import Joi from "joi"

export const addToCartSchema = Joi.object({
    productId: Joi.string().uuid().required(),
})

export const updateCartSchema = Joi.object({
    quantity: Joi.number().required()
})

export const findCartSchema = Joi.object({
    cartId: Joi.string().uuid().required()
})

export const findProductSchema = Joi.object({
    productId: Joi.string().uuid().required()
})