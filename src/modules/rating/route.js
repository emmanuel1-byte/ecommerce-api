import express from 'express'
import { validateJwt } from '../../middlewares/auth.js';
import { createRating, updateRating } from './controller.js';
const rating = express.Router();

rating.post('/:productId', validateJwt, createRating)

rating.patch('/:rateId', validateJwt, updateRating)

export default rating