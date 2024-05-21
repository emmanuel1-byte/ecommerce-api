import express from 'express'
import {
    createUser, deleteUser, getPaginatedListOfUsers,
    updateUser
} from './controller.js'
import { validateJwt } from '../../middlewares/auth.js'
import { requireRole } from '../../middlewares/checkUserRole.js'
import { checkBlacklistedToken } from '../../middlewares/blacklist.js'
const admin = express.Router()



admin.post('/', validateJwt, checkBlacklistedToken, requireRole("Admin"), createUser)

admin.get('/', validateJwt, checkBlacklistedToken, requireRole("Admin"), getPaginatedListOfUsers)

admin.patch('/:userId', validateJwt, checkBlacklistedToken, requireRole("Admin"), updateUser)

admin.delete('/:userId', validateJwt, checkBlacklistedToken, requireRole("Admin"), deleteUser)


export default admin