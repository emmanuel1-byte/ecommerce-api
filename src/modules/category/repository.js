import { logger } from "../../utils/logger.js";
import { Product } from "../product/model.js";
import { Category } from "./model.js";



/**
 * Creates a new category.
 *
 * @param {object} data - The data for the new category.
 * @param {string} data.name - The name of the new category.
 * @param {string} data.description - The description of the new category.
 * @returns {Promise<Category>} - The newly created category.
 */
async function create(data) {
  try {
    return await Category.create({
      name: data.name,
      description: data.description,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches all categories.
 *
 * @returns {Promise<Category[]>} - An array of all categories.
 */
async function fetchAllCategory() {
  try {
    return await Category.findAll({});
  } catch (err) {
    logger.error(err.stack);
  }
}


/**
 * Fetches a category by its ID, including the associated products.
 *
 * @param {number} categoryId - The ID of the category to fetch.
 * @returns {Promise<Category>} - The category with the specified ID, including its associated products.
 */
async function fetchCategoryById(categoryId) {
  try {
    return await Category.findByPk(categoryId, {
      include: {
        model: Product,
      },
    });
  } catch (err) {
    logger.error(err.stack);
  }
}



/**
 * Updates a category by its ID.
 *
 * @param {number} categoryId - The ID of the category to update.
 * @param {object} data - The updated data for the category.
 * @param {string} data.name - The new name for the category.
 * @param {string} data.description - The new description for the category.
 * @returns {Promise<Category[]>} - The affected categories.
 */
async function updateCategory(categoryId, data) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Category.update(
      {
        name: data.name,
        description: data.description,
      },
      { where: { id: categoryId }, returning: true }
    );
    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Deletes a category by its ID.
 *
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<number>} - The number of affected rows.
 */
async function deleteCategory(categoryId) {
  try {
    return await Category.destroy({
      where: { id: categoryId },
      force: true,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

const repository = {
  create,
  fetchAllCategory,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
};

export default repository;
