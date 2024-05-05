import { respond } from "../../utils/response.js";
import { emailEvent } from "../../services/email/email.js";
import { twoMonthsExpiry } from "../../utils/date-time.js";
import {
  generateAccessToken,
  generateToken,
} from "../../utils/generateToken.js";
import { repository } from "./repository.js";
import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
  tokenSchema,
} from "./schema.js";
import bcrypt from "bcrypt";
import { getCookie, setCookie } from "../../helpers/cookieHelper.js";

/**
 * Sign up a new user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 * @throws {Error} If there's an error during sign up.
 */
export async function signup(req, res, next) {
  try {
    const { error, vaidatedData } = await signUpSchema.validateAsync(req.body);
    if (error) return next(error);
    const newUser = await repository.create(vaidatedData);
    emailEvent.emit("send-email", {
      to: newUser.email,
      subject: "Confirm Your Account",
      html: `Please click the link below to confirm your email address <a href=${`${req.protocol}://${req.hostname}/v1/auth/verify?token=${j}`}>Click here to confirm your email address</a>`,
      emailType: "verifyAccount",
    });
    respond(
      res,
      201,
      true,
      "Account created successfully. Please check your email to verify your account."
    );
  } catch (err) {
    next(err);
  }
}

export async function verifyAccount(req, res, next) {
  try {
    const requestParams = await tokenSchema.validateAsync(req.params);
    const token = await repository.findToken(requestParams.token);
    if (!token) respond(res, 400, false, "Token does not exist");
    await repository.markAccountAsVerified(token.userId);
    await repository.deleteToken(token);
    respond(res, 200, true, "Account verified");
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { error, validatedData } = await loginSchema.validateAsync(req.body);
    if (error) return next(error);
    const user = await repository.findUserByEmail(validatedData.email);
    if (!user || (!await bcrypt.compare(validatedData.password, user.password)))
    return respond(res, 401, false, "Invalid credentials");
    const { access_token } = generateAccessToken(user.id);
    const refreshToken = generateToken(user.id, "refreshToken");
    setCookie(res, refreshToken);
    return respond(res, 200, true, "Login successfull", { access_token });
  } catch (err) {
    next(err);
  }
}

export async function refreshTokens(req, res, next) {
  try {
    const oldRefreshToken = getCookie(req);
    const existingToken = await repository.findToken(oldRefreshToken);
    const newRefreshToken = generateToken(existingToken.userId, "refreshToken");
    setCookie(req, res, next, newRefreshToken);
    const { access_token } = generateAccessToken(existingToken.userId);
    respond(res, 200, true, "Tokens refreshed succesfully", { access_token });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const validatedData = await forgotPasswordSchema.validateAsync(req.body);
    const user = await repository.findUserByEmail(validatedData.email);
    if (!user) respond(res, 404, false, "Email does not exist");
    emailEvent.emit("send-email", {
      to: newUser.email,
      subject: "Reset Password",
      html: ``,
      emailType: "resetPassword",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function verifyPasswordResetToken(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}
