import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
const { JWT_SECRET } = config;
import { oneHour, twoMonthsExpiry } from "./date-time.js";

export function generateTokens(userId) {
  const refreshToken = {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "verify_account",
    expiresIn: oneHour,
  };

  const accessToken = {
    access_token: jwt.sign({ sub: userId }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "20days",
    }),
  };

  const verificationToken = {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "verify_account",
    expiresIn: oneHour,
  };

  const resetPasswordToken = {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "reset_password",
    expiresIn: oneHour,
  };
  return {
    refreshToken,
    accessToken: accessToken.access_token,
    verificationToken,
    resetPasswordToken,
  };
}
