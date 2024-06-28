import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { Order } from "../order/model.js";

/**
 * Fetches the admin dashboard data, including the total number of users, products, and orders.
 *
 * @returns {Promise<{ total_users: number, total_products: number, total_orders: number }>} An object containing the total counts for users, products, and orders.
 * @throws {Error} If an error occurs while fetching the data.
 */
async function fetchAdminDashboard() {
  try {
    return {
        total_users: await User.count(),
        total_products: await Product.count(),
        total_orders: await Order.count(),
    };
  } catch (err) {
    logger.error(err.stack);
  }
}


const repository =  {
    fetchAdminDashboard,
}

export default repository