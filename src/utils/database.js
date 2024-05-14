import { Sequelize } from "sequelize";
import { logger } from "./logger.js";
import config from "./config.js";

/**
 * Creates a new Sequelize instance connected to the database specified by the `config.DATABASE_URI` configuration.
 *
 * The Sequelize instance is configured to use the PostgreSQL dialect and have logging disabled.
 */
export const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: "postgres",
  logging: false,
});

/**
 * Establishes a connection to the database and synchronizes the Sequelize models.
 *
 * This function attempts to authenticate the database connection and synchronize the Sequelize models.
 * If the connection is successful, a log message is written to the logger indicating that the database
 * connection has been established. If there is an error, a log message is written to the logger
 * indicating that the database connection failed.
 */
export async function databaseConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info("Database connection established");
  } catch (err) {
    logger.error("Database connection failed", err.message);
  }
}
