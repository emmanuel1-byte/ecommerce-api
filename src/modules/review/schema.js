import Joi from "joi";

export const createReviewSchema = Joi.object({
  comment: Joi.string().required(),
});

export const updateReviewSchema = Joi.object({
  comment: Joi.string().required(),
})

export const fetchProductSchema = Joi.object({
  productId: Joi.string().uuid().required()
})

export const fetchReviewSchema = Joi.object({
  reviewId: Joi.string().uuid().required()
})