import express from 'express'
import {
    createUser, deleteUser, getPaginatedListOfUsers,
    updateUser
} from './controller.js'
import { validateJwt } from '../../middlewares/auth.js'
import { checkBlacklistedToken } from '../../middlewares/blacklist.js'
import { authorizeRole } from '../../middlewares/roleChecker.js'
const admin = express.Router()



admin.post('/', validateJwt, checkBlacklistedToken, authorizeRole("Admin"), createUser)

admin.get('/', validateJwt, checkBlacklistedToken, authorizeRole("Admin"), getPaginatedListOfUsers)

admin.patch('/:userId', validateJwt, checkBlacklistedToken, authorizeRole("Admin"), updateUser)

admin.delete('/:userId', validateJwt, checkBlacklistedToken, authorizeRole("Admin"), deleteUser)


export default admin