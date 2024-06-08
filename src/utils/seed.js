import { Category } from "../modules/category/model.js";
import { logger } from "./logger.js";

export async function seedDatabase() {
  try {
    await Category.bulkCreate([
      {
        name: "Clothing",
        description: "Clothing products",
      },
      {
        name: "Electronics",
        description: "Electronics products",
      },
      {
        name: "Home",
        description: "Home products",
      },

      {
        name: "Kitchen",
        description: "Kitchen products",
      },
    ]);
    logger.info("Database seeded successfully");
  } catch (err) {
    logger.error(err.stack);
  }
}

seedDatabase();
