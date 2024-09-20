import Joi from 'joi'


export const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("Vendor", "User").required(),
    password: Joi.string().min(5).max(256).required()
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(256).required()
})

export const fetchTokenSchema = Joi.object({
    token: Joi.string().required()
})


export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})


export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(256).required(),
    confirmPassword: Joi.string().min(5).max(256).valid(Joi.ref("password")).required().messages({
        'any.only': 'Passwords do not match'
    })
})
