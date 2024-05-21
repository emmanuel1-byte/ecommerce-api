import express from 'express'
import { validateJwt } from '../../middlewares/auth.js'
import { checkBlacklistedToken } from '../../middlewares/blacklist.js'
import { upload } from '../../middlewares/upload.js'
import {
    deleteAccount, updatePassword, updateProfile,
    viewPrivateProfile, viewPublicProfile
} from './controller.js'
import { cache } from '../../middlewares/cache.js'
const profile = express.Router()

profile.put('/', validateJwt, checkBlacklistedToken, upload.single("file"), updateProfile)

profile.get('/public', validateJwt, checkBlacklistedToken, cache, viewPublicProfile)

profile.get('/private', validateJwt, checkBlacklistedToken, cache, viewPrivateProfile)

profile.patch('/update-password', validateJwt, checkBlacklistedToken, updatePassword)

profile.delete('/delete-account', validateJwt, checkBlacklistedToken, deleteAccount)

export default profile