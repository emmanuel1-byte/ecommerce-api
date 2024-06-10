import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { ProductRating } from "../rating/model.js";
import { Review } from "./model.js";

async function create(userId, productId, data) {
  try {
    return await sequelize.transaction(async (t) => {
      const review = await Review.create(
        {
          comment: data.comment,
          user_id: userId,
        },
        { transaction: t }
      );

      await ProductRating.create(
        {
          review_id: review,
          product_id: productId,
        },
        { transaction: t }
      );
      return review;
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

export async function fetchReviewById(reviewId) {
  try {
    return await Review.findByPk(reviewId);
  } catch (err) {
    logger.error(err.stack);
  }
}

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
  }
}

export async function deleteById(reviewId) {
  try {
    return await Review.destroy({ where: { id: reviewId }, force: true });
  } catch (err) {
    logger.error(err.stack);
  }
}

const repository = {
    create,
    fetchReviewById,
    update,
    deleteById
}

export default repository