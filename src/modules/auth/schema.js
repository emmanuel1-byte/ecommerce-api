import Joi from 'joi'

export const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("Admin", "Seller", "User").required(),
    password: Joi.string().min(5).max(256).required()
})


export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(256).required()
})

export const tokenSchema = Joi.object({
    token: Joi.string().required()
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})