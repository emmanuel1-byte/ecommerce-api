import express from 'express'
import {
    createUser, deleteUser, getPaginatedListOfUsers,
     updateUser
} from './controller.js'
const admin = express.Router()



admin.post('/', createUser)

admin.get('/', getPaginatedListOfUsers)

admin.patch('/:userId', updateUser)

admin.delete('/:userId', deleteUser)


export default admin