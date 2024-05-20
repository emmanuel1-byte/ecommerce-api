import Joi from "joi";




export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().optional(),
    role: Joi.string().valid("Admin", "Seller", "User"),
    password:  Joi.string().min(5).max(256).required()
})


export const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().optional(),
    role: Joi.string().valid("Admin", "Seller", "User"),
    password: Joi.string().min(5).max(256).required()
})



export const userParams = Joi.object({
    userId: Joi.string().uuid().required()
})


export const paginationSchema = Joi.object({
    page: Joi.number().default(1).optional(),
    limit: Joi.string().default(10).optional()
})