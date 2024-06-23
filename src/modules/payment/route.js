import express from 'express'
import { makePayment, verifyPayment } from './controller.js'
const payment = express.Router()

payment.post('/', makePayment)

payment.post('/callback', verifyPayment)

export default payment