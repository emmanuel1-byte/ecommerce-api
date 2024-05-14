import express from 'express'
import passport from './passport.js'
import { forgotPassword, google, login, logout, refreshTokens, resetPassword, signup, verifyAccount, verifyPasswordResetToken } from './controller.js'
import { checkAccountVerificationStatus, ensureUniqueUser, validateJwt } from '../../middlewares/auth.js'
const auth = express.Router()

auth.post('/signup', ensureUniqueUser, signup)

auth.post('/login', checkAccountVerificationStatus, login)

auth.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

auth.get('/google/callback', passport.authenticate('google', { session: false }), google)

auth.get('/verify-account', verifyAccount)

auth.post('/refresh-token', validateJwt, refreshTokens)

auth.post('/forgot-password', forgotPassword)

auth.post('/verify-password-reset-token', verifyPasswordResetToken)

auth.patch('/reset-password', resetPassword)

auth.post('/logout', logout)



export default auth