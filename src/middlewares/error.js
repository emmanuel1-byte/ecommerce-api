import { logger } from "../utils/logger.js";
import Joi from 'joi'
import { respond } from "../utils/response.js";

export function globalErrorHandler(err, req, res, next) {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    if (err instanceof Joi.ValidationError) {
        return respond(res, 400, err.message);
    }
    return respond(res, statusCode, "Internal Server Error");
}

export function routeNotFound(req, res, next) {
    return respond(res, 404, "Endpoint does not exist on this server")
}