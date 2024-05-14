import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema } from "../modules/auth/schema.js";
import { respond } from "../utils/response.js";
import repository from "../modules/auth/repository.js";
import config from "../utils/config.js";

/**
 * Middleware function to validate and verify the access token in the request.
 *
 * This middleware function is responsible for verifying the access token provided in the
 * `Authorization` header of the request. It checks if the token is present and valid, and
 * if so, it extracts the user ID from the token payload and attaches it to the request
 * object for further processing.
 *
 * If the token is missing or invalid, the middleware will respond with appropriate error
 * messages and HTTP status codes.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
export function validateJwt(req, res, next) {
  const accessToken = req.headers.authorization.split(" ")[1];
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
 * Middleware function to ensure a unique user during sign up.
 *
 * This middleware function is responsible for validating the sign up data and
 * checking if the email provided already exists in the system. If the email
 * already exists, it will return a 409 Conflict response. Otherwise, it will
 * call the next middleware function in the chain.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves when the middleware function completes.
 */
export async function ensureUniqueUser(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const existingUser = await repository.findUserByEmail(validatedData.email);
    if (existingUser) {
      return respond(res, 409, "Account already exist!");
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware function to check the account verification status of a user during login.
 *
 * This middleware function is responsible for validating the login data and checking if the
 * user's account has been verified. If the account is not verified, it will return a 403
 * Forbidden response. Otherwise, it will call the next middleware function in the chain.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves when the middleware function completes.
 */
export async function checkAccountVerificationStatus(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.findUserByEmail(validatedData.email);
    if (user && !user.verified) {
      return respond(res, 403, "Account not verified. Please verify your account via email.");
    }
    next()
  } catch (err) {
    next(err);
  }
}

