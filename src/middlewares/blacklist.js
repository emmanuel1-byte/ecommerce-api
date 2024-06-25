import authRepository from "../modules/auth/repository.js";
import { respond } from "../utils/response.js";

/**
 * Middleware function to check if the provided access token is blacklisted.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Resolves when the middleware has completed.
 */
export async function checkBlacklistedToken(req, res, next) {
    try {
        const existingToken = await authRepository.fetchBlackListedToken(req.accessToken)
        if (!existingToken) {
            return next()
        }
        return respond(res, 400, 'Token is blacklisted please login!')
    } catch (err) {
        next(err)
    }
}