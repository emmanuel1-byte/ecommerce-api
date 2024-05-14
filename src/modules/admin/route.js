import express from 'express'
import { createUser, deleteUser, getPaginatedListOfUsers, login, updateUser } from './controller.js'
import { cache } from '../../middlewares/cache.js'
const admin = express.Router()

admin.post('/login', login)

admin.post('/', createUser)

admin.get('/', cache, getPaginatedListOfUsers)

admin.patch('/:userId', updateUser)

admin.delete('/:userId', deleteUser)


export default admin