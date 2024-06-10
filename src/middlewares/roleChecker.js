import authRepository from "../modules/auth/repository.js";
import { respond } from "../utils/response.js";

/**
 * Middleware function that checks if the authenticated user has the required role to perform an action.
 *
 * @param {string} role - The required role for the action.
 * @returns {function} - A middleware function that can be used in an Express route.
 */
export function authorizeRole(role) {
  return async function (req, res, next) {
    try {
      const user = await authRepository.fetchUserById(req.userId);
      if (user && user.role === role) {
        return next();
      }
      return respond(
        res,
        403,
        "Access denied: insufficient permissions to perform this action"
      );
    } catch (err) {
      next(err);
    }
  };
}
