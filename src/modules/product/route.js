import express from 'express'
import { validateJwt } from '../../middlewares/auth'
import { requireRole } from '../../middlewares/checkUserRole'
const product = express.Router()


product.post('/', validateJwt, requireRole("Seller"))

product.get('/')

product.get('/:productId')

product.put('/:productId', validateJwt, requireRole("Seller"))

product.delete('/:productId', validateJwt, requireRole("Seller"))

export default product