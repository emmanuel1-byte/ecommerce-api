import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { Order, OrderItem } from "./model.js";
import cartRepository from "../cart/repository.js";
import { Product } from "../product/model.js";

/**
 * Creates a new order in the database.
 *
 * @param {number} userId - The ID of the user placing the order.
 * @param {object} data - An object containing the shipping details for the order.
 * @param {object} data.shippingDetails - An object containing the shipping details for the order.
 * @returns {Promise<Order>} - The newly created order.
 */
async function create(userId, data) {
  try {
    return await sequelize.transaction(async (t) => {
      const existingCart = await cartRepository.fetchCart(userId);
      const newOrder = await Order.create(
        {
          user_id: userId,
          total_amount: existingCart.subtotal,
          shipping_details: data.shippingDetails,
        },
        { transaction: t }
      );

      await Promise.all(
        existingCart.cart.Products.map(async (item) => {
          await OrderItem.create(
            {
              order_id: newOrder.id,
              product_id: item.id,
            },
            { transaction: t }
          );
        })
      );

      return newOrder;
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Updates the shipping details for an order belonging to the specified user.
 *
 * @param {number} userId - The ID of the user whose order should be updated.
 * @param {object} data - An object containing the updated shipping details.
 * @param {string} data.shippingDetails.address - The updated shipping address.
 * @param {string} data.shippingDetails.city - The updated shipping city.
 * @param {string} data.shippingDetails.state - The updated shipping state.
 * @param {string} data.shippingDetails.zipCode - The updated shipping zip code.
 * @param {string} data.shippingDetails.country - The updated shipping country.
 * @returns {Promise<Order[]>} - The updated order.
 */
async function updateOrder(userId, data) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Order.update(
      {
        shipping_details: {
          address: data.shippingDetails.address || sequelize.literal("address"),
          city: data.shippingDetails.city || sequelize.literal("city"),
          state: data.shippingDetails.state || sequelize.literal("state"),
          zipCode: data.shippingDetails.zipCode || sequelize.literal("zipCode"),
          country: data.shippingDetails.country || sequelize.literal("country"),
        },
      },
      { where: { user_id: userId }, returning: true }
    );
    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Updates the status of an order for the specified user.
 *
 * @param {number} userId - The ID of the user whose order status should be updated.
 * @param {string} status - The new status to set for the order.
 * @returns {Promise<number>} - The number of affected rows.
 */
async function updateOrderStatus(userId, status) {
  try {
    return await Order.update(
      { status: status },
      { where: { user_id: userId } }
    );
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches all orders for the specified user.
 *
 * @param {number} userId - The ID of the user whose orders should be fetched.
 * @returns {Promise<Order[]>} - An array of orders for the specified user.
 */
async function fetchOrder(userId) {
  try {
    return await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          through: {
            model: OrderItem,
          },
        },
      ],
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches an order by its ID, including the associated products and order items.
 *
 * @param {number} orderId - The ID of the order to fetch.
 * @returns {Promise<Order>} - The order with the specified ID, including its associated products and order items.
 */
async function fetchOrderById(orderId) {
  try {
    return await Order.findByPk(orderId, {
      include: [
        {
          model: Product,
          through: {
            model: OrderItem,
          },
        },
      ],
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

const repository = {
  create,
  updateOrderStatus,
  fetchOrder,
  fetchOrderById,
  updateOrder,
};

export default repository;
