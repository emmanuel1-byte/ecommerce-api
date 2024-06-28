import { logger } from "../../utils/logger.js";
import { Review } from "./model.js";

/**
 * Creates a new review with the provided user ID, product ID, and review data.
 *
 * @param {number} userId - The ID of the user creating the review.
 * @param {number} productId - The ID of the product being reviewed.
 * @param {object} data - An object containing the review data, such as the comment.
 * @returns {Promise<Review>} - The newly created review instance.
 */
async function create(userId, productId, data) {
  try {
    return await Review.create({
      user_id: userId,
      product_id: productId,
      comment: data.comment,
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}
/**
 * Fetches a review by its ID.
 *
 * @param {number} reviewId - The ID of the review to fetch.
 * @returns {Promise<Review>} - The review instance, or null if not found.
 */
export async function fetchReviewById(reviewId) {
  try {
    return await Review.findByPk(reviewId);
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Updates an existing review with the provided data.
 *
 * @param {number} reviewId - The ID of the review to update.
 * @param {object} data - An object containing the updated review data, such as the comment.
 * @returns {Promise<Review>} - The updated review instance.
 */
export async function update(reviewId, data) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Review.update(
      {
        comment: data.comment,
      },
      { where: { id: reviewId }, returning: true }
    );

    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Deletes a review by its ID.
 *
 * @param {number} reviewId - The ID of the review to delete.
 * @returns {Promise<number>} - The number of affected rows.
 */
export async function deleteById(reviewId) {
  try {
    return await Review.destroy({ where: { id: reviewId }, force: true });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
  create,
  fetchReviewById,
  update,
  deleteById,
};

export default repository;
