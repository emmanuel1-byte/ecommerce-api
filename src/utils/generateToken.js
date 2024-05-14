import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import config from "./config.js";
import { oneHour, twoMonthsExpiry } from "./date-time.js";

/**
 * Generates a verification token for a user.
 *
 * @param {string} userId - The ID of the user to generate the token for.
 * @returns {object} An object containing the generated token details, including the token value, token type, and expiration time.
 */
export function generateVerificationToken(userId) {
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "verify_account",
    expiresIn: oneHour,
  };
}

/**
 * Generates a refresh token for the specified user.
 *
 * @param {string} userId - The ID of the user to generate the refresh token for.
 * @returns {Object} An object containing the generated refresh token details, including the token value, token type, and expiration time.
 */
export function generateRefreshToken(userId) {
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "refreshToken",
    expiresIn: twoMonthsExpiry
  }
}

/**
 * Generates an access token for the provided user ID.
 *
 * @param {string} userId - The ID of the user to generate the access token for.
 * @returns {object} An object containing the generated access token.
 */
export function generateAccessToken(userId) {
  return {
    access_token: jwt.sign({ sub: userId }, config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "20days",
    }),
  };
}

/**
 * Generates a reset password token for the specified user.
 *
 * @param {string} userId - The ID of the user to generate the reset password token for.
 * @returns {Object} An object containing the generated reset password token details, including the token value, token type, and expiration time.
 */
export function generateResetPasswordToken(userId) {
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "reset_password",
    expiresIn: oneHour,
  }
}
