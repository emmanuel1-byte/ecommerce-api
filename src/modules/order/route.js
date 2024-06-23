import express from 'express';
import { validateJwt } from '../../middlewares/auth.js';
import { createOrder, getOrder, listOrder, updateOrder } from './controller.js';
const order = express.Router();

order.post('/', validateJwt, createOrder)

order.get('/', validateJwt, listOrder)

order.get('/:orderId', validateJwt, getOrder)

order.put('/:orderId', validateJwt, updateOrder)

export default order;