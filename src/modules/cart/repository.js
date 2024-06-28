import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { Cart } from "./model.js";

/**
 * Creates a new cart item for the specified user and product.
 *
 * @param {number} userId - The ID of the user to create the cart item for.
 * @param {number} productId - The ID of the product to add to the cart.
 * @returns {Promise<Cart>} - A Promise that resolves to the newly created cart item.
 */
async function create(userId, productId) {
  try {
    return await Cart.create({
      product_id: productId,
      user_id: userId,
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Increases the quantity of the cart item with the specified ID.
 *
 * @param {number} cartId - The ID of the cart item to increase the quantity for.
 * @returns {Promise<void>} - A Promise that resolves when the quantity has been increased.
 */
async function increaseQuantity(cartId) {
  try {
    const cart = await Cart.findByPk(cartId);
    cart.quantity++;
    await cart.save();
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Decreases the quantity of the cart item with the specified ID.
 *
 * @param {number} cartId - The ID of the cart item to decrease the quantity for.
 * @returns {Promise<void>} - A Promise that resolves when the quantity has been decreased.
 */
async function decreaseQuantity(cartId) {
  try {
    const cart = await Cart.findByPk(cartId);
    cart.quantity--;
    await cart.save();
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches the cart for the specified user, including the associated products.
 *
 * @param {number} userId - The ID of the user to fetch the cart for.
 * @returns {Promise<{ cart: Cart[], subtotal: number }>} - The user's cart and the subtotal of all items in the cart.
 */
async function fetchCart(userId) {
  try {
    const cart = await User.findByPk(userId, {
      attributes: [],
      include: [
        {
          model: Product,
          through: {
            model: Cart,
            attributes: ["id", "quantity"],
          },
          attributes: ["id", "product_name", "price", "thumbnail_image"],
        },
      ],
    });

    const subtotal = cart.Products.reduce((sum, product) => {
      return sum + product.price * product.Cart.quantity;
    }, 0);

    return { cart, subtotal };
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches a cart by its ID.
 *
 * @param {number} cartId - The ID of the cart to fetch.
 * @returns {Promise<Cart>} - The cart with the specified ID.
 */
async function fetchCartById(cartId) {
  try {
    return await Cart.findByPk(cartId);
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Deletes a product from the user's cart.
 *
 * @param {number} productId - The ID of the product to delete from the cart.
 * @returns {Promise<number>} - The number of rows deleted.
 */
async function deleteFromCart(productId) {
  try {
    return await Cart.destroy({
      where: { product_id: productId },
      force: true,
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
  create,
  increaseQuantity,
  decreaseQuantity,
  fetchCart,
  fetchCartById,
  deleteFromCart,
};

export default repository;
