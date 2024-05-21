import { createClient } from 'redis'
export const client = await createClient()
    .on('err', (err) => logger.error(err.message))
    .connect()
import { respond } from '../utils/response.js'
import { logger } from '../utils/logger.js'



/**
 * Middleware function that handles caching for the current request URL.
 * It attempts to retrieve cached data, and if not found, sets the cache with the response data.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>}
 */
export async function cache(req, res, next) {
    try {
        const cacheData = await client.get(req.originalUrl)
        if (cacheData) {
            return getCache(req, res, cacheData)
        } else {
            setCache(req, res)
        }
        next()
    } catch (err) {
        next(err)
    }
}


/**
 * Intercepts the response JSON method to cache the response data if the status code is 200.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
function setCache(req, res) {
    const originalJson = res.json.bind(res)
    res.json = async (body) => {
        if (res.statusCode === 200) {
            try {
                await client.set(req.originalUrl, JSON.stringify(body.data))
            } catch (err) {
                logger.error(err.message)
            }
        }
        logger.info('Cache miss for ' + req.originalUrl)
        return originalJson(body)
    }
}


/**
 * Sends a response with the cached data.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} cacheData - The cached data retrieved from Redis.
 * @returns {Object} - The response object with the cached data.
 */
function getCache(req, res, cacheData) {
    logger.info('Cache hit for ' + req.originalUrl)
    return respond(res, 200, "User's retrieved", JSON.parse(cacheData))
}