import {
  createReviewSchema,
  findProductSchema,
  updateReviewSchema,
} from "./schema.js";
import produtRepository from "../product/repository.js";
import { respond } from "../../utils/response.js";
import repository from "./repository.js";

export async function createReview(req, res, next) {
  try {
    const params = await findProductSchema.validateAsync(req.params);
    const validatedData = await createReviewSchema.validateAsync(req.body);
    const product = await produtRepository.fetchProductById(params.productId);
    if (!product)
      return respond(res, 404, "Error creating review: Product not found");
    const newRating = await repository.create(
      req.userId,
      product.id,
      validatedData
    );
    return respond(res, 201, "Rating created succesfully", {
      rating: newRating,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateReview(req, res, next) {
  try {
    const params = await findRateSchema.validateAsync(req.params);
    const validatedData = await updateReviewSchema.validateAsync(req.body);
    const existingReview = await repository.fetchRatingById(params.reviewId);
    if (!existingReview)
      return respond(res, 404, "Error creating rating: Product not found");
    const updatedReview = await repository.update(
      existingReview.id,
      validatedData
    );
    return respond(res, 200, "Rating updated succesfully", {
      review: updatedReview,
    });
  } catch (err) {
    next(err);
  }
}
export async function deleteReview(req, res, next) {
  try {
    const params = await findRateSchema.validateAsync(req.params);
    const review = await repository.fetchReviewById(params.reviewId);
    if (!review) return respond(res, 404, "Review not found");
    await repository.deleteById(review.id);
    return respond(res, 200, "Review deleted succesfully");
  } catch (err) {
    next(err);
  }
}
