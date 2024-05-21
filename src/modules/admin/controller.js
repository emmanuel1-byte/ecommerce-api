import { respond } from "../../utils/response.js";
import { repository } from "./repository.js";
import authRespository from "../auth/repository.js";
import {
    createUserSchema, paginationSchema,
    updateUserSchema, userSchema
} from "./schema.js";




/**
 * Creates a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the user creation request.
 * @throws {Error} - Any error that occurs during user creation.
 */
export async function createUser(req, res, next) {
    try {
        const validatedData = await createUserSchema.validateAsync(req.body)
        await authRespository.create(validatedData)
        return respond(res, 201, "User created succesfully")
    } catch (err) {
        next(err)
    }
}


/**
 * Retrieves a paginated list of users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the get users request.
 * @throws {Error} - Any error that occurs during user retrieval.
 */
export async function getPaginatedListOfUsers(req, res, next) {
    try {
        const params = await paginationSchema.validateAsync(req.query)
        const { page, limit } = params
        const user = await repository.fetchAllUser(paginationPayload);
        return respond(res, 200, "User's retrieved", {
            user: user.data,
            pagination: {
                page, limit,
                total_pages: Math.ceil(user.count / limit),
                total_items: user.count
            }
        })
    } catch (err) {
        next(err)
    }
}


/**
 * Updates a user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the update user request.
 * @throws {Error} - Any error that occurs during user update.
 */
export async function updateUser(req, res, next) {
    try {
        const params = await userSchema.validateAsync(req.params)
        const existingUser = await repository.findById(params.userId)
        if (!existingUser) return respond(res, 404, "User not found")
        const validatedData = await updateUserSchema.validateAsync(req.body)
        const user = await repository.update(existingUser.id, validatedData)
        return respond(res, 201, "User updated succesfully", { user })
    } catch (err) {
        next(err)
    }
}



/**
 * Deletes a user by their ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The ID of the user to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user has been deleted.
 */
export async function deleteUser(req, res, next) {
    try {
        const params = await userSchema.validateAsync(req.params)
        const user = repository.deleteById(params.userId)
        if (!user) return respond(res, 404, "User not found")
        return respond(res, 200, "User deleted succesfully")
    } catch (err) {
        next(err)
    }
}