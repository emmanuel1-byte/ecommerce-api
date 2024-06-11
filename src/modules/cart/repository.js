import { sequelize } from "../../utils/database";
import { logger } from "../../utils/logger";
import { Cart, CartProduct } from "./model";

async function create(userId, data) {
  try {
    return await sequelize.transaction(async (t) => {
      const cart = await Cart.create(
        {
          user_id: userId,
          quantity: data.quantity,
        },
        { transaction: t }
      );
      await CartProduct.create(
        {
          cart_id: cart.id,
          product_id: --data.productId,
        },
        { transaction: t }
      );
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

async function update(userId, data) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Cart.update(
      {
        quantity: data.quantity,
      },
      { where: { user_id: userId }, returning: true }
    );
    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
  }
}


async function fetchCart(userId) {
  try {
    return await Cart.findOne({
      where: { user_id: userId },
    });
  } catch (err) {
    logger.error(err.stack);
  }
}


async function deleteFromCart(productId) {
  try {
    return await CartProduct.destroy({
      where: { product_id: productId },
      force: true,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}


const repository = {
    create,
    update,
    fetchCart,
    deleteFromCart,
}

export default repository;