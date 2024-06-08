import Joi from 'joi'

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    categoryId: Joi.string().required(),
})  


export const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional(),
    quantity: Joi.number().optional(),
    categoryId: Joi.string().optional(),
})

export const createCategorySchema = Joi.object({
    categoryName: Joi.string().required(),
})

export const getProductSchema = Joi.object({
    productId: Joi.string().required()
})

export const productSearchSchema = Joi.object({
    query: Joi.string().required()
})

export const paginationSchema = Joi.object({
    page: Joi.number().default(1).optional(),
    limit: Joi.number().default(10).optional()
})