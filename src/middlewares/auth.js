import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema } from "../modules/auth/schema.js";
import { respond } from "../utils/response.js";
import { repository } from "../modules/auth/repository.js";

export function validateJwt(req, res, next) {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) {
    respond(res, 400, "Access token required!");
  }
  jwt.verify(accessToken, "", (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return respond(
          res,
          401,
          "Your session has expired. Please log in again."
        );
      }
      return respond(res, 401, false, "Unauthorized access. Please log in.");
    }
    req.userId = payload.sub;
    next();
  });
}

export async function ensureUniqueUser(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const existingUser = await repository.findUserByEmail(validatedData.email);
    if (existingUser) {
      return respond(res, 409, false, "Account already exist!");
    }
    next();
  } catch (err) {
    next(err);
  }
}

export async function checkAccountVerificationStatus(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.findUserByEmail(validatedData.email);
    if (user && !user.verified) {
      return respond(
        res,
        403,
        false,
        "Account not verified. Please verify your account via email."
      );
    }
    return respond(res, 401, false, "Invalid credentials");
  } catch (err) {
    next(err);
  }
}
