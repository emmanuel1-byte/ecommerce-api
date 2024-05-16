import { logger } from "../utils/logger.js";
import Joi from 'joi'
import { respond } from "../utils/response.js";


export function globalErrorHandler(err, req, res, next) {
    logger.error(err.message);
    if (err instanceof Joi.ValidationError) {
        return respond(res, 400, err.message);
    }
    return respond(res, 500, "Internal Server Error");
}


export function routeNotFound(req, res, next) {
    return respond(res, 404, "Endpoint does not exist on this server")
}