import { twoMonthsExpiry } from "../utils/date-time.js";

export async function setCookie(res, refreshToken) {
  res.clearCookie("resfrehToken");
  res.cookie("refreshToken", refreshToken, {
    maxAge: twoMonthsExpiry,
    secure: false,
    httpOnly: true
  });
}

export async function getCookie(req) {
  req.cookies.refreshToken;
}
