import Joi from "joi";

export const ratingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
});

