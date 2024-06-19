import {
  createReviewSchema,
  fetchProductSchema,
  fetchReviewSchema,
  updateReviewSchema,
} from "./schema.js";
import produtRepository from "../product/repository.js";
import { respond } from "../../utils/response.js";
import repository from "./repository.js";

/**
 * Creates a new review for a given product.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the review is created.
 */
export async function createReview(req, res, next) {
  try {
    const params = await fetchProductSchema.validateAsync(req.params);
    const validatedData = await createReviewSchema.validateAsync(req.body);
    const existingProduct = await produtRepository.fetchProductById(
      params.productId
    );
    if (!existingProduct)
      return respond(res, 404, "Error creating review: Product not found");
    const newReview = await repository.create(
      req.userId,
      existingProduct.id,
      validatedData
    );
    return respond(res, 201, "Review created succesfully", {
      review: newReview,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates an existing review.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reviewId - The ID of the review to update.
 * @param {Object} req.body - The updated review data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the review is updated.
 */
export async function updateReview(req, res, next) {
  try {
    const params = await fetchReviewSchema.validateAsync(req.params);
    const validatedData = await updateReviewSchema.validateAsync(req.body);
    const existingReview = await repository.fetchReviewById(params.reviewId);
    if (!existingReview) return respond(res, 404, "Review not found");
    const updatedReview = await repository.update(
      existingReview.id,
      validatedData
    );
    return respond(res, 200, "Review updated succesfully", {
      review: updatedReview,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes an existing review.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.reviewId - The ID of the review to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the review is deleted.
 */
export async function deleteReview(req, res, next) {
  try {
    const params = await fetchReviewSchema.validateAsync(req.params);
    const existingReview = await repository.fetchReviewById(params.reviewId);
    if (!existingReview) return respond(res, 404, "Review not found");
    await repository.deleteById(existingReview.id);
    return respond(res, 200, "Review deleted succesfully");
  } catch (err) {
    next(err);
  }
}
