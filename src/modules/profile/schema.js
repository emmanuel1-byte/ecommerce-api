import Joi from 'joi'

export const updateProfileSchema = Joi.object({
    fullname: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
})

export const fetchUserSchema = Joi.object({
    userId: Joi.string().uuid().required()
})


