import authRepository from "../modules/auth/repository"
import { respond } from "../utils/response.js"


export function requireRole(role) {
    return async function (req, res, next) {
        try {
            const user = await authRepository.findUserById(req.userId)
            if (user && user.role === role) next()
            return respond(res, 403, 'Acces denied you do not have suficient permission to perform this action!')
        } catch (err) {
            next(err)
        }
    }
}