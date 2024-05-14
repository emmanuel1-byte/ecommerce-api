import Joi from 'joi'

/**
 * Validates the sign up request payload.
 * 
 * The schema includes the following fields:
 * - `email`: The email address of the user signing up.
 * - `role`: The role of the user signing up, which must be one of "Admin", "Seller", or "User".
 * - `password`: The password of the user signing up, which must be between 5 and 256 characters long.
 */
export const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("Admin", "Seller", "User").required(),
    password: Joi.string().min(5).max(256).required()
})


/**
 * Validates the login request payload.
 * 
 * The schema includes the following fields:
 * - `email`: The email address of the user logging in.
 * - `password`: The password of the user logging in.
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(256).required()
})

/**
 * Validates the token request payload.
 * 
 * The schema includes the following fields:
 * - `token`: The token to be validated.
 */
export const tokenSchema = Joi.object({
    token: Joi.string().required()
})

/**
 * Validates the forgot password request payload.
 * 
 * The schema includes the following fields:
 * - `email`: The email address of the user requesting a password reset.
 */
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})

/**
 * Validates the reset password request payload.
 * 
 * The schema includes the following fields:
 * - `email`: The email address of the user requesting a password reset.
 * - `password`: The new password to be set for the user.
 * - `confirmPassword`: The confirmation of the new password, which must match the `password` field.
 * 
 * If the `confirmPassword` does not match the `password`, the schema will return an error with the message "Passwords do not match".
 */
export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(256).required(),
    confirmPassword: Joi.string().min(5).max(256).valid(Joi.ref("password")).required().messages({
        'any.only': 'Passwords do not match'
    })
})