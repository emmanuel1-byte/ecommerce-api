import Joi from "joi";

export const createRatingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
});

export const updateRatingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
})

export const findProductSchema = Joi.object({
  productId: Joi.string().uuid().required()
})

export const findRateSchema = Joi.object({
  rateId: Joi.string().uuid().required()
})
