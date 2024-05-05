export async function setCookie(res, refreshToken) {
  res.clearCookie("resfrehToken");
  res.cookie("refreshToken", refreshToken, {
    maxAge: twoMonthsExpiry,
    scure: false,
  });
}

export async function getCookie(req) {
  req.cookies.refreshToken;
}
