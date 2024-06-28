import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";
import { Profile } from "./model.js";

/**
 * Updates a user's profile information.
 *
 * @param {number} userId - The ID of the user whose profile is being updated.
 * @param {string} profilePicture - The new profile picture for the user.
 * @param {object} data - An object containing the new profile data for the user.
 * @param {string} data.fullname - The new full name for the user.
 * @param {string} data.dateOfBirth - The new date of birth for the user.
 * @returns {Promise<object>} - The updated profile record.
 */
async function update(userId, profilePicture, data) {
  try {
    const [updatedRows, updatedRecords] = await Profile.update(
      {
        fullname: data.fullname || sequelize.literal("fullname"),
        profile_picture: profilePicture || sequelize.literal("profile_picture"),
        date_of_birth: data.dateOfBirth || sequelize.literal("date_of_birth"),
      },
      { where: { userId: userId }, returning: true }
    );
    await client.del(["/v1/profile/private", `/v1/profile/public/${userId}`]);
    return updatedRecords;
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches the profile information for the specified user.
 *
 * @param {number} userId - The ID of the user whose profile information should be fetched.
 * @returns {Promise<Object>} - The profile information for the specified user, including their email address.
 */
async function fetchProfile(userId) {
  try {
    return await Profile.findOne({
      where: { userId: userId },
      include: { model: User, attributes: ["email"] },
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches the private profile information for the specified user.
 *
 * @param {number} userId - The ID of the user whose private profile information should be fetched.
 * @returns {Promise<Object>} - The private profile information for the specified user, including their full name, profile picture, date of birth, and email address.
 */
async function fetchPrivateProfile(userId) {
  try {
    return await Profile.findOne({
      where: { userId: userId },
      attributes: ["fullname", "profile_picture", "date_of_birth"],
      include: { model: User, attributes: ["email"] },
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches the public profile information for the user with the given userId.
 *
 * @param {string} userId - The userId of the user whose public profile is to be fetched.
 * @returns {Promise<Object>} - The public profile information, including the user's fullname, profile picture, and email.
 */
async function fetchPublicProfile(userId) {
  try {
    return await Profile.findOne({
      where: { userId: userId },
      attributes: ["fullname", "profile_picture"],
      include: { model: User, attributes: ["email"] },
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Deletes a user's account from the database.
 *
 * @param {number} userId - The ID of the user whose account should be deleted.
 * @returns {Promise<number>} - The number of rows affected by the deletion operation.
 */
async function deleteUserById(userId) {
  try {
    return await Profile.destroy({ where: { userId: userId }, force: true });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Repository module for managing user profile data.
 */

const repository = {
  update,
  fetchProfile,
  fetchPrivateProfile,
  fetchPublicProfile,
  deleteUserById,
};

export default repository;
