import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./schema.js";

/**
 * Creates a new category.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the category data.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is created.
 */
export async function createCategory(req, res, next) {
  try {
    const validatedData = await createCategorySchema.validateAsync(req.body);
    const newCategory = await repository.create(validatedData);
    return respond(res, 200, "Category created successfully", {
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves all categories.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the categories are retrieved.
 */
export async function getAllCategory(req, res, next) {
  try {
    const category = await repository.fetchAllCategory();
    return respond(res, 200, "Category retrieved", { category });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a category by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.categoryId - The ID of the category to retrieve.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is retrieved.
 */
export async function getCategory(req, res, next) {
  try {
    const params = await getCategorySchema.validateAsync(req.params);
    const category = await repository.fetchCategoryById(params.categoryId);
    if (!category) return respond(res, 404, "category not found");
    return respond(res, 200, "Category found", { category });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates an existing category.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.categoryId - The ID of the category to update.
 * @param {Object} req.body - The updated category data.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is updated.
 */
export async function updateCategory(req, res, next) {
  try {
    const params = await getCategorySchema.validateAsync(req.params);
    const validatedData = await updateCategorySchema.validateAsync(req.body);
    const existingCategory = await repository.findCategoryById(
      params.categoryId
    );
    if (!existingCategory) return respond(res, 404, "category not found");
    const category = await repository.updateCategory(
      existingCategory.id,
      validatedData
    );
    return respond(res, 200, "Category updated", { category });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes an existing category.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.categoryId - The ID of the category to delete.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is deleted.
 */
export async function deleteCategory(req, res, next) {
  try {
    const params = await getCategorySchema.validateAsync(req.params);
    const existingCategory = await repository.deleteCategory(params.categoryId);
    if (!existingCategory) return respond(res, 404, "category not found");
    return respond(res, 200, "Category deleted");
  } catch (err) {
    next(err);
  }
}
