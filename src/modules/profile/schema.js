import Joi from 'joi'

export const updateProfileSchema = Joi.object({
    fullname: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
})

export const userSchema = Joi.object({
    userId: Joi.string().uuid().required()
})

export const profileSchema = Joi.object({
    profileId: Joi.string().uuid().required()
})