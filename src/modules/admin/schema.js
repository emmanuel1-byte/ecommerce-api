import Joi from "joi";

/**
 * Defines a Joi schema for validating the parameters used to authenticate a user.
 * 
 * @param {object} params - The parameters to validate for user authentication.
 * @param {string} params.username - The username for the user.
 * @param {string} params.password - The password for the user, which must be between 5 and 256 characters long.
 * @returns {object} - A Joi schema object that can be used to validate the user authentication parameters.
 */
export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(5).max(256).required()
})

/**
 * Defines a Joi schema for validating the parameters used to create a new user.
 * 
 * @param {object} params - The parameters to validate for creating a new user.
 * @param {string} params.email - The email address for the new user.
 * @param {string} [params.username] - The username for the new user.
 * @param {string} params.role - The role for the new user, which must be one of "Admin", "Seller", or "User".
 * @param {string} params.password - The password for the new user, which must be between 5 and 256 characters long.
 * @returns {object} - A Joi schema object that can be used to validate the user creation parameters.
 */
export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().optional(),
    role: Joi.string().valid("Admin", "Seller", "User"),
    password:  Joi.string().min(5).max(256).required()
})

/**
 * Defines a Joi schema for validating the parameters used to update a user.
 * 
 * @param {object} params - The parameters to validate for updating a user.
 * @param {string} params.email - The new email address for the user.
 * @param {string} [params.username] - The new username for the user.
 * @param {string} params.role - The new role for the user, which must be one of "Admin", "Seller", or "User".
 * @param {string} params.password - The new password for the user, which must be between 5 and 256 characters long.
 * @returns {object} - A Joi schema object that can be used to validate the user update parameters.
 */
export const updateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().optional(),
    role: Joi.string().valid("Admin", "Seller", "User"),
    password: Joi.string().min(5).max(256).required()
})


/**
 * Defines a Joi schema for validating user parameters.
 * 
 * @param {object} params - The user parameters to validate.
 * @param {string} params.userId - The unique identifier of the user.
 * @returns {object} - A Joi schema object that can be used to validate the user parameters.
 */
export const userParams = Joi.object({
    userId: Joi.string().uuid().required()
})

/**
 * Defines a Joi schema for validating pagination parameters.
 * 
 * @param {object} params - The pagination parameters to validate.
 * @param {number} [params.page=1] - The page number to retrieve.
 * @param {number} [params.limit=10] - The maximum number of items to return per page.
 * @returns {object} - A Joi schema object that can be used to validate the pagination parameters.
 */
export const paginationSchema = Joi.object({
    page: Joi.number().default(1).optional(),
    limit: Joi.string().default(10).optional()
})