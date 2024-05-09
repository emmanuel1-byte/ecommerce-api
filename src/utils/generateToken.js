import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import config from "./config.js";
import { oneHour, twoMonthsExpiry } from "./date-time.js";

export function generateVerificationToken(userId) {
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "verify_account",
    expiresIn: oneHour,
  };
}

export function generateRefreshToken(userId){
  return{
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "refreshToken",
    expiresIn: twoMonthsExpiry
  }
}

export function generateAccessToken(userId) {
  return {
    access_token: jwt.sign({ sub: userId }, config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "20days",
    }),
  };
}

export function generateResetPasswordToken(userId){
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: "reset_password",
    expiresIn: oneHour,
  }
}
