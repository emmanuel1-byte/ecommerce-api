import { respond } from "../../utils/response.js";
import {
  sendResetPasswordEmail,
  sendVerifcationEmail,
} from "../../services/email/nodemailer.js";
import { generateTokens } from "../../helpers/generateToken.js";
import repository from "./repository.js";
import {
  fetchTokenSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "./schema.js";
import bcrypt from "bcrypt";
import { getCookie, setCookie } from "../../helpers/cookie.js";

/**
 * Signs up a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the signup request.
 * @throws {Error} - Any error that occurs during signup.
 */
export async function signup(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const newUser = await repository.create(validatedData);
    const { verificationToken } = generateTokens(newUser.id);
    sendVerifcationEmail(req, newUser.email, verificationToken.token);
    await repository.createToken(verificationToken);
    respond(
      res,
      201,
      "Account created successfully. Please check your email to verify your account."
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Verifies a user's account using a verification token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the account verification request.
 * @throws {Error} - Any error that occurs during account verification.
 */
export async function verifyAccount(req, res, next) {
  try {
    const params = await fetchTokenSchema.validateAsync(req.query);
    const token = await repository.fetchToken(params.token);
    if (!token) return respond(res, 404, "Token does not exist");
    await repository.markAccountAsVerified(token.userId);
    await repository.deleteToken(token.token);
    return respond(res, 200, "Account verified");
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (!user) return respond(res, 404, "User does not exist");
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) return respond(res, 401, "Invalid credentials");
    const { refreshToken, accessToken } = generateTokens(user.id);
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
    return respond(res, 200, "Login successfull", { user, accessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles Google login flow.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the Google login flow.
 * @throws {Error} - Any error that occurs during Google login flow handling.
 */
export async function google(req, res, next) {
  try {
    const { refreshToken, accessToken } = generateTokens(req.user.userId);
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
    return respond(res, 200, "Login successfull", {
      access_token: accessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Refreshes access and refresh tokens for a logged-in user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the token refresh request.
 * @throws {Error} - Any error that occurs during token refresh.
 */
export async function refreshTokens(req, res, next) {
  try {
    const existingToken = await repository.fetchToken(getCookie(req));
    const { refreshToken, accessToken } = generateTokens(existingToken.userId);
    setCookie(res, refreshToken.token);
    await repository.createToken(refreshToken);
    respond(res, 200, "Tokens refreshed succesfully", {
      access_token: accessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Initiates password reset by sending a reset link to the user's email.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the forgot password request.
 * @throws {Error} - Any error that occurs during forgot password handling.
 */
export async function forgotPassword(req, res, next) {
  try {
    const validatedData = await forgotPasswordSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (!user) return respond(res, 404, "Account does not exist");
    const { resetPasswordToken } = generateTokens(user.id);
    await repository.createToken(resetPasswordToken);
    sendResetPasswordEmail(req, user.email, resetPasswordToken.token);
    return respond(res, 200, "Reset password link sent to your email");
  } catch (err) {
    next(err);
  }
}

/**
 * Verifies a password reset token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the password reset token verification request.
 * @throws {Error} - Any error that occurs during password reset token verification.
 */
export async function verifyPasswordResetToken(req, res, next) {
  try {
    const params = await fetchTokenSchema.validateAsync(req.query);
    const existingToken = await repository.fetchToken(params.token);
    if (!existingToken) return respond(res, 404, "Token does not exist");
    await repository.deleteToken(existingToken.token);
    return respond(res, 200, "Token is valid");
  } catch (err) {
    next(err);
  }
}

/**
 * Resets a user's password using the reset token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the reset password request.
 * @throws {Error} - Any error that occurs during password reset.
 */
export async function resetPassword(req, res, next) {
  try {
    const validatedData = await resetPasswordSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (!user) return respond(res, 401, "Email does not exist");
    await repository.updatePassword(validatedData);
    return respond(res, 200, "Password reset successfull");
  } catch (err) {
    next(err);
  }
}

/**
 * Logs out a user by deleting their access token and blacklisting their refresh token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the logout request.
 * @throws {Error} - Any error that occurs during logout.
 */
export async function logout(req, res, next) {
  try {
    const refreshToken = getCookie(req);
    const accessToken = req.accessToken;
    await repository.createBlackList(accessToken);
    await repository.deleteToken(refreshToken);
    return respond(res, 200, "Logout succesfull");
  } catch (err) {
    next(err);
  }
}
