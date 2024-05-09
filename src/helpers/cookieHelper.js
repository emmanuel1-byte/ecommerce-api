import { twoMonthsExpiry } from "../utils/date-time.js";

export function setCookie(res, refreshToken) {
  res.clearCookie("resfrehToken");
  res.cookie("refreshToken", refreshToken, {
    maxAge: twoMonthsExpiry,
    secure: true,
    httpOnly: true
  });
}

export function getCookie(req) {
  return req.cookies.refreshToken;
}
