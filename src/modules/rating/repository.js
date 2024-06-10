import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { ProductRating, Rating } from "./model.js";

/**
 * Creates a new rating for a product.
 *
 * @param {number} userId - The ID of the user creating the rating.
 * @param {number} productId - The ID of the product being rated.
 * @param {object} data - An object containing the rating data.
 * @param {number} data.rating - The rating value to be stored.
 * @returns {Promise<object>} - The created rating object.
 */
async function create(userId, productId, data) {
  try {
    return sequelize.transaction(async (t) => {
      const rating = await Rating.create(
        {
          rating: data.rating,
          user_id: userId,
        },
        { transaction: t }
      );
      await ProductRating.create(
        {
          rate_id: rating.id,
          product_id: productId,
        },
        { transaction: t }
      );
      return rating;
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Updates an existing rating in the database.
 *
 * @param {number} rateId - The ID of the rating to update.
 * @param {object} data - An object containing the updated rating data.
 * @param {number} data.rating - The new rating value.
 * @returns {Promise<object>} - The updated rating object.
 */
async function update(rateId, data) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Rating.update(
      {
        rating: data.rating,
      },
      { where: { id: rateId }, returning: true }
    );
    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches a rating by its ID.
 *
 * @param {number} ratingId - The ID of the rating to fetch.
 * @returns {Promise<object>} - The rating object, or undefined if not found.
 */
async function fetchRatingById(ratingId) {
  try {
    return await Rating.findByPk(ratingId);
  } catch (err) {
    logger.error(err.stack);
  }
}

async function deleteById(ratingId) {
  try {
    return await Rating.destroy({ where: { id: ratingId }, force: true });
  } catch (err) {
    logger.error(err.stack);
  }
}

const repository = {
  create,
  update,
  deleteById,
  fetchRatingById,
};

export default repository;
