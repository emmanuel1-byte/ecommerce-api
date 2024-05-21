/**
 * Responds to the client with the specified status code, message, and data.
 *
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code to send.
 * @param {string} message - The message to include in the response.
 * @param {*} data - The data to include in the response.
 * @returns {Object} The Express response object with the specified status code, message, and data.
 */

export function respond(res, statusCode, message, data) {
  const success = statusCode >= 200 && statusCode < 300;
  return res.status(statusCode).json({ success, message, data });
}

