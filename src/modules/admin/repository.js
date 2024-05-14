import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";


/**
 * Retrieves a user by their username.
 *
 * @param {string} username - The username to search for.
 * @returns {Promise<User|null>} - The found user, or null if not found.
 */
async function findByUsername(username) {
    try {
        return await User.findOne({ where: { username: username } })
    } catch (err) {
        logger.error(err.message)
    }
}


/**
 * Retrieves a user by their unique identifier.
 *
 * @param {number} userId - The unique identifier of the user to retrieve.
 * @returns {Promise<User|null>} - The user with the specified ID, or null if not found.
 */
async function findById(userId) {
    try {
        return await User.findByPk(userId)
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Creates a new user in the database.
 *
 * @param {Object} data - The user data to create.
 * @param {string} data.username - The username of the new user.
 * @param {string} data.email - The email address of the new user.
 * @param {string} data.password - The password of the new user.
 * @param {string} data.role - The role of the new user.
 * @returns {Promise<User>} - The newly created user.
 */
async function create(data) {
    try {
        return await User.create({
            username: data.username,
            email: data.email,
            password: password,
            role: data.role
        })
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Retrieves a paginated list of all users.
 *
 * @param {Object} data - The pagination data.
 * @param {number} data.page - The current page number.
 * @param {number} data.limit - The number of records to return per page.
 * @returns {Promise<{ data: User[], count: number }>} - An object containing the paginated user data and the total count of users.
 */
async function readAll(data) {
    try {
        return {
            data: await User.findAll({ offset: (data.page - 1) * data.limit, limit: data.limit }),
            count: await User.count()
        }
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Updates a user's information in the database.
 *
 * @param {Object} data - The user data to update.
 * @param {string} data.username - The new username for the user.
 * @param {string} data.email - The new email address for the user.
 * @param {string} data.password - The new password for the user.
 * @param {string} data.role - The new role for the user.
 * @returns {Promise<number>} The number of updated records.
 */
async function update(data) {
    try {
        const [updatedRows, updateRecords] = User.update({
            username: data.username || sequelize.literal("username"),
            email: data.email || sequelize.literal("email"),
            password: data.password || sequelize.literal("password"),
            role: data.role || sequelize.literal("role")
        })
        return updateRecords
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Permanently deletes a user from the database.
 *
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<number>} - The number of rows affected by the delete operation.
 */
async function delete_(userId) {
    try {
        return await User.destroy({ where: { id: userId }, force: true })
    } catch (err) {
        logger.error(err.message)
    }
}
/**
 * Provides a set of repository functions for managing users in the admin module.
 */
export const repository = {
    findByUsername,
    create,
    update,
    readAll,
    findById,
    delete_
}