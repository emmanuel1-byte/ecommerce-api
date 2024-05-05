import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { oneHour } from "./date-time.js";

export function generateToken(userId, tokenType) {
  return {
    userId: userId,
    token: randomBytes(16).toString("hex"),
    token_type: tokenType,
    expiresIn: oneHour,
  };
}

export function generateAccessToken(userId) {
  return {
    access_token: jwt.sign({ sub: userId }, "", {
      algorithm: "HS256",
      expiresIn: "20days",
    }),
  };
}
