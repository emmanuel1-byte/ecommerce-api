import config from "../utils/config.js";
// const { REDIS_URL } = config;
import { createClient } from "redis";
import { logger } from "../utils/logger.js";
const client = await createClient()
  .on("error", (err) =>
    logger.error(`Error connecting to Redis server: ${err}`)
  )
  .on("connect", () => logger.info("Connected to Redis server"))
  .connect();

/**
 * Provides a simple caching mechanism using Redis.
 *
 * The `Cache` class provides methods to interact with a Redis cache store.
 * It allows you to get, set, and delete cache entries.
 *
 */
export class Cache {
  static async get(key) {
    try {
      const cacheStore = await client.get(key);
      if (cacheStore === null) {
        logger.error("Cache miss ");
        return null;
      }
      logger.info("Cache hit");
      return JSON.parse(cacheStore);
    } catch (err) {
      logger.error(err.stack);
    }
  }

  static async set(key, data) {
    try {
      return await client.set(key, JSON.stringify(data));
    } catch (err) {
      logger.error(err.stack);
    }
  }

  static async delete(key) {
    try {
      const cacheStore = await client.get(key);
      if (cacheStore === null) {
        logger.error("Cache miss");
        return null;
      }
      logger.info("deleted from cache");
      return await client.del(key);
    } catch (err) {
      logger.error(err.stack);
    }
  }
}
