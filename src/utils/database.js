import { Sequelize } from "sequelize";
import { logger } from "./logger.js";
import config from "./config.js";


/**
 * Creates a new Sequelize instance with the specified database configuration.
 *
 * @param {string} config.DATABASE_URI - The database connection URI.
 * @returns {Sequelize} A new Sequelize instance.
 */
export const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: "postgres",
  logging: false,
});



/**
 * Establishes a connection to the database and synchronizes the database schema.
 *
 * @async
 * @function databaseConnection
 * @returns {Promise<void>} - Resolves when the database connection is established and the schema is synchronized.
 * @throws {Error} - If there is an error connecting to the database or synchronizing the schema.
 */
export async function databaseConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info("Database connection established");
  } catch (err) {
    logger.error("Database connection failed", err.stack);
  }
}
