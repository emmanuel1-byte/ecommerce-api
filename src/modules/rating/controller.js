import {
  createRatingSchema,
  fetchProductSchema,
  fetchRatingSchema,
  updateRatingSchema,
} from "./schema.js";
import produtRepository from "../product/repository.js";
import { respond } from "../../utils/response.js";
import repository from "./repository.js";


/**
 * Creates a new rating.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.productId - The ID of the product to create a rating for.
 * @param {Object} req.body - The rating data to create.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rating is created.
 */
export async function createRating(req, res, next) {
  try {
    const params = await fetchProductSchema.validateAsync(req.params);
    const validatedData = await createRatingSchema.validateAsync(req.body);
    const existingRating = await produtRepository.fetchProductById(
      params.productId
    );
    if (!existingRating)
      return respond(res, 404, "Error creating rating: Product not found");
    const rating = await repository.create(
      req.userId,
      existingRating.id,
      validatedData
    );
    return respond(res, 201, "Rating created succesfully", { rating });
  } catch (err) {
    next(err);
  }
}


/**
 * Updates an existing rating.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.rateId - The ID of the rating to update.
 * @param {Object} req.body - The updated rating data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rating is updated.
 */
export async function updateRating(req, res, next) {
  try {
    const params = await fetchRatingSchema.validateAsync(req.params);
    const validatedData = await updateRatingSchema.validateAsync(req.body);
    const existingRating = await repository.fetchRatingById(params.rateId);
    if (!existingRating)
      return respond(res, 404, "Error creating rating: Product not found");
    const updatedRating = await repository.update(
      existingRating.id,
      validatedData
    );
    return respond(res, 200, "Rating updated succesfully", {
      rating: updatedRating,
    });
  } catch (err) {
    next(err);
  }
}


/**
 * Deletes a rating by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the rating is deleted.
 */
export async function deleteRating(req, res, next) {
  try {
    const parans = await fetchRatingSchema.validateAsync(req.params);
    const rating = await repository.fetchRatingById(parans.rateId);
    if (!rating) return respond(res, 404, "rating not found");
    await repository.deleteById(rating.id);
    return respond(res, 200, "Rating deleted succesfully");
  } catch (err) {
    next(err);
  }
}
