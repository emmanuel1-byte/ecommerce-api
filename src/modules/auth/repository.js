import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { Profile } from "../profile/model.js";
import { BlackList, Token, User } from "./model.js";

/**
 * Creates a new user and associated profile.
 *
 * @param {Object} data - The user data to create.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.role - The role of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} [data.profile_picture] - The profile picture of the user.
 * @param {string} data.fullname - The full name of the user.
 * @returns {Promise<User>} The created user.
 */
async function create(data) {
  try {
    return await sequelize.transaction(async t => {

      const user = await User.create({
        email: data.email,
        role: data.role,
        password: data.password,
      }, { transaction: t });

      await Profile.create({
        userId: user.id,
        profile_picture: data.profile_picture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        fullname: data.fullname,
      }, { transaction: t })

      return user
    })

  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email address to search for.
 * @returns {Promise<User|null>} - The user object if found, otherwise null.
 */
async function findUserByEmail(email) {
  try {
    return await User.findOne({ where: { email: email } });
  } catch (err) {
    logger.error(err.stack);
  }
}

async function findUserById(userId) {
  try {
    return await User.findByPk(userId)
  } catch (err) {
    logger.error(err.stack);
  }
}


/**
 * Updates the password for a user with the given email address.
 *
 * @param {Object} data - An object containing the email and new password for the user.
 * @param {string} data.email - The email address of the user whose password should be updated.
 * @param {string} data.password - The new password for the user.
 * @returns {Promise<User>} - A Promise that resolves to the updated User instance.
 */
async function updatePassword(data) {
  try {
    const user = await User.findOne({ where: { email: data.email } })
    user.password = data.password
    return await user.save()
  } catch (err) {
    logger.error(err.stack);
  }
}
/**
 * Creates a new token in the database.
 *
 * @param {Object} data - The data for the new token.
 * @param {number} data.userId - The ID of the user the token is associated with.
 * @param {string} data.token - The token value.
 * @param {string} data.token_type - The type of the token (e.g. "access", "refresh").
 * @param {number} data.expiresIn - The number of seconds the token is valid for.
 * @returns {Promise<Token>} The created token.
 */

async function createToken(data) {
  try {
    return await Token.create({
      userId: data.userId,
      token: data.token,
      token_type: data.token_type,
      expiresIn: data.expiresIn,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}


/**
 * Finds a token in the database.
 * @param {string} token - The token to search for.
 * @returns {Promise<Token|null>} The found token, or null if not found.
 */
async function findToken(token) {
  try {
    return await Token.findOne({ where: { token: token } });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Marks a user account as verified.
 *
 * @param {number} userId - The ID of the user whose account should be marked as verified.
 * @returns {Promise<number>} - The number of affected rows.
 */
async function markAccountAsVerified(userId) {
  try {
    return await User.update({ verified: true }, { where: { id: userId } });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Deletes a token from the database.
 *
 * @param {string} token - The token to be deleted.
 * @returns {Promise<number>} - The number of rows affected by the deletion.
 */
async function deleteToken(token) {
  try {
    return await Token.destroy({ where: { token: token }, force: true });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Creates a new entry in the BlackList table with the provided token.
 *
 * @param {string} token - The token to be added to the BlackList.
 * @returns {Promise<void>} - A Promise that resolves when the BlackList entry is created.
 */
async function createBlackList(token) {
  try {
    return await BlackList.create({ token: token })
  } catch (err) {
    logger.error(err.stack);
  }
}

async function findBlackListedToken(token) {
  try {
    return await BlackList.findOne({ where: { token: token } })
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Provides a set of repository functions for the auth module.
 */
const repository = {
  create,
  findUserByEmail,
  findUserById,
  updatePassword,
  findToken,
  markAccountAsVerified,
  deleteToken,
  createToken,
  createBlackList,
  findBlackListedToken
};

export default repository