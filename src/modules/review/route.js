import express from 'express';
import { validateJwt } from '../../middlewares/auth.js';
import { createReview, deleteReview, updateReview } from './controller.js';
const review = express.Router();

review.post('/:productId', validateJwt, createReview);

review.patch('/:reviewId', validateJwt, updateReview);

review.delete('/:reviewId', validateJwt, deleteReview);

export default review;