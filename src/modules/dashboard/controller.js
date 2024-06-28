import { respond } from "../../utils/response.js";
import repository from "./repository.js";

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

export async function getVendorDashBoard(req, res, next) {
  try {
    const dashBoard = await repository.fetchVendorDasboard(req.userId);
    return respond(res, 200, "DashBoard retrieved succesfully", { dashBoard });
  } catch (err) {
    next(err);
  }
}
