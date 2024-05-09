export function respond(res, statusCode, message, data = null) {
  const successCodes = [200, 201]
  if (successCodes.includes(statusCode)) {
    return res.status(statusCode).json({ success: true, message, data })
  }
  return res.status(statusCode).json({ success: false, message, data });
}
