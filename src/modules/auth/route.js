import express from 'express'
import { login, signup, verifyAccount } from './controller.js'
import { checkAccountVerificationStatus, ensureUniqueUser } from '../../middlewares/auth.js'
const auth = express.Router()

auth.post('/signup', ensureUniqueUser, signup)

auth.post('/login', checkAccountVerificationStatus, login)

auth.post('/verify-account', verifyAccount)

export default auth