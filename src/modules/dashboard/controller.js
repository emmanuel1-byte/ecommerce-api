import { respond } from "../../utils/response.js";
import repository from "./repository.js";

/**
 * Retrieves the admin dashboard data.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
export async function getAdminDashBoard(req, res, next) {
  try {
    const adminDashBoard = await repository.fetchAdminDashboard();
    return respond(res, 200, "Admin dashBoard retrieved succesfully", {
      dashBoard: adminDashBoard,
    });
  } catch (err) {
    next(err);
  }
}
