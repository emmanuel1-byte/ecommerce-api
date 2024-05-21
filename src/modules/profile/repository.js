import { sequelize } from "../../utils/database";
import { logger } from "../../utils/logger";
import { User } from "../auth/model";
import { Profile } from "./model";


/**
 * Updates the user's profile information.
 *
 * @param {number} userId - The ID of the user whose profile is being updated.
 * @param {string} [profilePicture] - The new profile picture URL for the user.
 * @param {object} data - An object containing the new profile data.
 * @param {string} [data.fullname] - The new full name for the user.
 * @param {string} [data.dateOfBirth] - The new date of birth for the user.
 * @returns {Promise<number>} - The number of rows affected by the update operation.
 */
async function updateProfile(userId, profilePicture, data) {
    try {
        return await Profile.update({
            fullname: data.fullname || sequelize.literal('fullname'),
            profile_picture: profilePicture || sequelize.literal('profile_picture'),
            date_of_birth: data.dateOfBirth || sequelize.literal('date_of_birth'),

        }, { where: { userId: userId } })

    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Finds a user's profile in the database.
 *
 * @param {number} userId - The ID of the user whose profile to find.
 * @returns {Promise<Profile|null>} - The user's profile, or null if not found.
 */
async function findProfile(userId) {
    try {
        return await Profile.findOne({ where: { userId: userId } })
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Fetches the private profile information for the specified user.
 *
 * @param {number} userId - The ID of the user whose private profile information should be fetched.
 * @returns {Promise<Object>} - The private profile information for the specified user, including their full name, profile picture, and date of birth.
 */
async function fetchPrivateProfile(userId) {
    try {
        return await Profile.findOne({ where: { userId: userId }, attributes: ["fullname", "profile_picture", "date_of_birth"] })
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Fetches the public profile information for the user with the given userId.
 *
 * @param {string} userId - The userId of the user whose public profile information should be fetched.
 * @returns {Promise<{ fullname: string, profile_picture: string }>} - The public profile information for the user, including their fullname and profile picture.
 */
async function fetchPublicProfile(userId) {
    try {
        return await Profile.findOne({ where: { userId: userId }, attributes: ["fullname", "profile_picture"] })
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Updates the password for the user with the specified ID.
 *
 * @param {number} userId - The ID of the user whose password should be updated.
 * @param {string} password - The new password for the user.
 * @returns {Promise<void>} - A Promise that resolves when the password has been updated.
 */
async function updatePassword(userId, password) {
    try {
        const user = await User.findByPk(userId)
        user.password = password
        return await user.save()
    } catch (err) {
        logger.error(err.message)
    }
}

/**
 * Deletes a user's account from the database.
 *
 * @param {number} userId - The ID of the user whose account should be deleted.
 * @returns {Promise<number>} - The number of rows affected by the deletion operation.
 */
async function deleteAccount(userId) {
    try {
        return await Profile.destroy({ where: { userId: userId }, force: true })
    } catch (err) {
        logger.error(err.message)
    }
}



/**
 * Repository module for managing user profile data.
 */

const repository = {
    updateProfile,
    findProfile,
    fetchPrivateProfile,
    fetchPublicProfile,
    deleteAccount,
    updatePassword,
}

export default repository;