import express from 'express'
import { validateJwt } from '../../middlewares/auth.js'
import { checkBlacklistedToken } from '../../middlewares/blacklist.js'
import { fileFilter, handlefileSizeLimitError, upload } from '../../middlewares/upload.js'
import {
    deleteAccount, updateProfile,
    viewPrivateProfile, viewPublicProfile
} from './controller.js'
import { cache } from '../../middlewares/cache.js'
const profile = express.Router()

profile.put('/', validateJwt, checkBlacklistedToken, upload.single('file'), fileFilter,
    handlefileSizeLimitError, updateProfile)

profile.get('/public/:userId', validateJwt, checkBlacklistedToken, cache, viewPublicProfile)

profile.get('/private', validateJwt, checkBlacklistedToken, cache, viewPrivateProfile)

profile.delete('/delete-account', validateJwt, checkBlacklistedToken, deleteAccount)

export default profile