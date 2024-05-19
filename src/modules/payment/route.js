import express from 'express'
const payment = express.Router()

payment.get('/paystack/callback')

payment.get('/paystack/verify-transaction')

export default payment