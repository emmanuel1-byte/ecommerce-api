import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const getCategorySchema = Joi.object({
  categoryId: Joi.string().uuid().required(),
});
