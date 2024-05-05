import jwt from "jsonwebtoken";
import { User } from "../modules/auth/model";
import { signUpSchema } from "../modules/auth/schema";
import { errorhandler } from "../utils/errorHandler";

export function validateJwt(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res
      .status(400)
      .json({ success: false, message: "Authorization header required!" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) {
    return res
      .status(400)
      .json({ success: false, message: "Access token required!" });
  }
  jwt.verify(accessToken, "", (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in.",
      });
    }
    req.userId = payload.sub;
    next();
  });
}

export async function checkUserExistence(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Account already exist!" });
    }
    next();
  } catch (err) {
    errorhandler(err, req, res, next);
  }
}

export async function accountVerificationStatus(req, res, next) {
  try {
    if (!user.verified) {
      res.status(403),
        json({
          success: false,
          message:
            "Account not verified. Please verify your account via email.",
        });
    }
  } catch (err) {
    errorhandler(err, req, res, next);
  }
}


