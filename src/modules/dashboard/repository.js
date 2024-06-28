import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { Order } from "../order/model.js";

async function fetchAdminDashboard() {
  try {
    return {
        total_users: await User.count(),
        total_products: await Product.count(),
        total_orders: await Order.count(),
        // top_selling_products: await Product.findAll({
        //   attributes: ["id", "name", "price"],
        //   where: { deletedAt: null },
        //   limit: 2,
        // }),
    };
  } catch (err) {
    logger.error(err.stack);
  }
}

async function fetchVendorDasboard(userId) {
  try {
  } catch (err) {
    logger.error(err.stack);
  }
}


const repository =  {
    fetchAdminDashboard,
    fetchVendorDasboard
}

export default repository