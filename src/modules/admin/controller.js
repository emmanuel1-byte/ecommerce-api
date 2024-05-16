import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import { respond } from "../../utils/response.js";
import { setCookie } from "../../helpers/cookieHelper.js";
import authRepository from '../auth/repository.js'
import { repository } from "./repository.js";
import {
    createUserSchema, loginSchema, paginationSchema,
    updateUserSchema, userParams
} from "./schema.js";


/**
 * Logs in an admin using username and password.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the login request.
 * @throws {Error} - Any error that occurs during login.
 */
export async function login(req, res, next) {
    try {
        const validatedData = await loginSchema.validateAsync(req.body)
        const user = await repository.findByUsername(validatedData.username)
        if (!user || (await bcrypt.compare(validatedData.password, user.password)))
            return respond(res, 401, "Invalid credentials");
        const { access_token } = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id);
        await authRepository.createToken(refreshToken)
        setCookie(refreshToken.token)
        return respond(res, 200, "Login successfull", { access_token });
    } catch (err) {
        next(err)
    }
}

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
        const newUser = await repository.create(validatedData)
        return respond(res, 201, "User created succesfully", { user: newUser })
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
        const paginationPayload = await paginationSchema.validateAsync(req.query)
        const { page, limit } = paginationPayload
        const user = await repository.readAll(paginationPayload);
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
        const requestParam = await userParams.validateAsync(req.params)
        const existingUser = await repository.findById(requestParam.userId)
        if (!existingUser) if (!user) return respond(res, 404, "User not found")
        const validatedData = await updateUserSchema.validateAsync(req.body)
        const user = repository.update(requestParam.userId, validatedData)
        return respond(res, 201, "User created succesfully", { user })
    } catch (err) {
        next(err)
    }
}

/**
 * Deletes a user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the update user request.
 * @throws {Error} - Any error that occurs during user update.
 */
export async function deleteUser() {
    try {
        const requestParam = await userParams.validateAsync(req.body)
        const user = repository.update(requestParam.userId)
        if (!user) return respond(res, 404, "User not found")
        return respond(res, 200, "User deleted succesfully", { user })
    } catch (err) {
        next(err)
    }
}