import express  from 'express'
import { login, signup } from './controller.js'
const auth = express.Router()

auth.post('/signup', signup)

auth.post('/login', login)

export default auth