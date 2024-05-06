import { respond } from "../../utils/response.js";
import { sendResetPasswordEmail, sendVerifcationEmail } from "../../services/email/email.js";
import { generateAccessToken, generateToken, } from "../../utils/generateToken.js";
import { repository } from "./repository.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signUpSchema, tokenSchema, } from "./schema.js";
import bcrypt from "bcrypt";
import { getCookie, setCookie } from "../../helpers/cookieHelper.js";



export async function signup(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    const newUser = await repository.create(validatedData);
    const verificationToken = generateToken(newUser.id, "verificationToken");
    sendVerifcationEmail(req, newUser.email, verificationToken.token)
    await repository.createToken(verificationToken);
    respond(res, 201, true, "Account created successfully. Please check your email to verify your account.");
  } catch (err) {
    next(err);
  }
}

export async function verifyAccount(req, res, next) {
  try {
    const requestQuery = await tokenSchema.validateAsync(req.query);
    const tokenRecord = await repository.findToken(requestQuery.token);
    if (!tokenRecord) respond(res, 404, false, "Token does not exist");
    await repository.markAccountAsVerified(tokenRecord.userId);
    await repository.deleteToken(tokenRecord.token);
    respond(res, 200, true, "Account verified");
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.findUserByEmail(validatedData.email);
    if (!user || !(await bcrypt.compare(validatedData.password, user.password)))
      return respond(res, 401, false, "Invalid credentials");
    const { access_token } = generateAccessToken(user.id);
    const refreshToken = generateToken(user.id, "refreshToken");
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
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
    setCookie(res, newRefreshToken.token);
    await repository.createToken(newRefreshToken);
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
    sendResetPasswordEmail(req, newUser.email, verificationToken.token)
    return respond(res, 200, true, "Reset password link sent to your email")
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const validatedData = await resetPasswordSchema.validateAsync(req.body)
    const user = await repository.findUserByEmail(validatedData.email)
    if (!user) return respond(res, 401, false, "Email does not exist")
    await repository.updatePassword(validatedData)
    return respond(res, 200, true, "Password reset successfull")
  } catch (err) {
    next(err);
  }
}

export async function verifyPasswordResetToken(req, res, next) {
  try {
    const { token } = req.query
    const existingToken = await repository.findToken(token)
    if (!existingToken) respond(res, 404, false, "Token does not exist");
    return respond(res, 200, true, "Token is valid")
  } catch (err) {
    next(err);
  }
}


export async function logout(req, res, next) {
  try {
    const refreshToken = getCookie(req)
    const accessToken = req.accessToken
    await repository.createBlackList(refreshToken)
    await repository.deleteToken(accessToken)
    return respond(res, 200, true, "Logout succesfull")
  } catch (err) {
    next(err);
  }
}
