import { createClient } from 'redis'
const client = createClient()
import { logger } from '../utils/logger.js'
import { respond } from '../utils/response.js'

/**
 * Middleware function that handles caching of API responses using Redis.
 *
 * This middleware function is responsible for:
 * 1. Connecting to the Redis client.
 * 2. Checking if the current request's URL is cached in Redis.
 * 3. If the data is cached, responding with the cached data.
 * 4. If the data is not cached, calling the next middleware function.
 * 5. If the response from the next middleware function has a 200 status code, caching the response data in Redis for 1 hour.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A Promise that resolves when the middleware function has completed.
 */
export async function cache(req, res, next) {
    try {
        await client.connect()
        const cacheKey = `${req.originalUrl}`
        const cacheData = await client.get(cacheKey)
        if (cacheData) return respond(res, 200, JSON.parse(cacheData))
        next()

        if (res.statusCode === 200) {
            const data = res.locals.data
            if (data) await client.set(cacheKey, JSON.stringify(cacheData), 'EX', 3600)
        }
    } catch (err) {
        logger.error(err.message)
    }
}