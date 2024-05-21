import { logger } from "../utils/logger.js";
import Joi from 'joi'
import { respond } from "../utils/response.js";


/**
 * Global error handling middleware.
 * Logs the error and sends an appropriate response to the client.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export function globalErrorHandler(err, req, res, next) {
    logger.error(err.message);
    if (err instanceof Joi.ValidationError) {
        return respond(res, 400, err.message);
    }
    return respond(res, 500, "Internal Server Error");
}


/**
 * Middleware to handle routes that are not found.
 * Sends a 404 response with a message indicating the endpoint does not exist.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export function routeNotFound(req, res, next) {
    return respond(res, 404, "Endpoint does not exist on this server")
}