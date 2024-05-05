import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: "postgres",
  logging: false,
});
import { logger } from "./logger.js";
import config from "./config.js";

export async function databaseConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info("Database connection established");
  } catch (err) {
    logger.error("Database connection failed", err.message);
  }
}
