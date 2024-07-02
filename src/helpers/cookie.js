import { twoMonthsExpiry } from "./date-time.js";

/**
 * Sets a secure, HttpOnly cookie with the provided refresh token.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} refreshToken - The refresh token to be stored in the cookie.
 */
export function setCookie(res, refreshToken) {
  res.clearCookie("resfrehToken");
  res.cookie("refreshToken", refreshToken, {
    maxAge: twoMonthsExpiry,
    secure: true,
    httpOnly: true
  });
}

/**
 * Gets the refresh token from the request cookies.
 *
 * @param {Object} req - The HTTP request object.
 * @returns {string|undefined} The refresh token from the cookies, or undefined if not present.
 */
export function getCookie(req) {
  return req.cookies.refreshToken;
}
