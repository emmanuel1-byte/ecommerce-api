import { logger } from "../utils/logger.js";
import Joi from 'joi'
import { respond } from "../utils/response.js";
/**
 * Handles global errors that occur in the application.
 *
 * This middleware function is responsible for logging errors, determining the appropriate
 * HTTP status code, and sending a response back to the client. If the error is a Joi
 * validation error, it will return a 400 Bad Request response with the error message.
 * Otherwise, it will return a 500 Internal Server Error response.
 *
 * @param {Error} err - The error object that was thrown.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */

export function globalErrorHandler(err, req, res, next) {
    console.error(err)
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    if (err instanceof Joi.ValidationError) {
        return respond(res, 400, err.message);
    }
    return respond(res, statusCode, "Internal Server Error");
}

/**
 * Responds with a 404 Not Found status code and a message indicating that the requested endpoint does not exist on the server.
 *
 * This middleware function is used to handle requests to endpoints that are not defined in the application. It should be placed at the end of the middleware stack to catch any requests that have not been handled by previous middleware.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export function routeNotFound(req, res, next) {
    return respond(res, 404, "Endpoint does not exist on this server")
}