import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";

/**
 * Retrieves a user by their unique identifier.
 *
 * @param {number} userId - The unique identifier of the user to retrieve.
 * @returns {Promise<User|null>} - The user with the specified ID, or null if not found.
 */
async function fetchUserById(userId) {
  try {
    return await User.findByPk(userId);
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches all users with pagination.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of users to fetch per page.
 * @returns {Promise<{ data: User[], count: number }>} - An object containing the fetched users and the total count of users.
 */
async function fetchAllUser(page, limit) {
  try {
    return {
      data: await User.findAll({
        offset: (page - 1) * limit,
        limit: limit,
        attributes: [
          "id",
          "email",
          "role",
          "account_status",
          "verified",
          "createdAt",
          "updatedAt",
        ],
      }),
      pagination: {
        page,
        limit,
        total_pages: Math.ceil((await User.count()) / limit),
        total_items: await User.count(),
      },
    };
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Updates a user's email, password, and role in the database.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {object} data - An object containing the updated user data.
 * @param {string} [data.email] - The new email address for the user.
 * @param {string} [data.password] - The new password for the user.
 * @param {string} [data.role] - The new role for the user.
 * @returns {Promise<object[]>} - An array of sanitized user records, with the password field removed.
 */
async function update(userId, data) {
  try {
    const [updatedRows, updateRecords] = await User.update(
      {
        email: data.email || sequelize.literal("email"),
        password: data.password || sequelize.literal("password"),
        role: data.role || sequelize.literal("role"),
      },
      { where: { id: userId }, returning: true }
    );

    const sanitizedRecords = updateRecords.map((record) => {
      const { password, ...sanitizedRecords } = record.get({ plain: true });
      return sanitizedRecords;
    });
    return sanitizedRecords;
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Permanently deletes a user from the database.
 *
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<number>} - The number of rows affected by the delete operation.
 */
async function deleteById(userId) {
  try {
    return await User.destroy({ where: { id: userId }, force: true });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}
/**
 * Provides a set of repository functions for managing users in the admin module.
 */
export const repository = {
  update,
  fetchAllUser,
  fetchUserById,
  deleteById,
};
