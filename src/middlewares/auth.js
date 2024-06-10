import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema } from "../modules/auth/schema.js";
import { respond } from "../utils/response.js";
import repository from "../modules/auth/repository.js";
import config from "../utils/config.js";


/**
 * Middleware function that validates the JWT from the Authorization header.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
export function validateJwt(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return respond(res, 400, "Access token required!");
  jwt.verify(accessToken, config.JWT_SECRET, (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return respond(res, 401, "Your session has expired. Please log in again.");
      }
      return respond(res, 401, "Unauthorized access. Please log in.");
    }
    req.accessToken = accessToken
    req.userId = payload.sub;
    next();
  });
}



/**
 * Middleware function that ensures the user being registered is unique by checking their email.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>}
 */
export async function ensureUniqueUser(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const existingUser = await repository.fetchUserByEmail(validatedData.email);
    if (existingUser) {
      return respond(res, 409, "Account already exist!");
    }
    next();
  } catch (err) {
    next(err);
  }
}


/**
 * Middleware function that checks if the user's account is verified.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>}
 */
export async function checkAccountVerificationStatus(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (user && !user.verified) {
      return respond(res, 403, "Account not verified. Please verify your account via email.");
    }
    next()
  } catch (err) {
    next(err);
  }
}

