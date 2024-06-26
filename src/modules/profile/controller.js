import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import { fetchUserSchema, updateProfileSchema } from "./schema.js";
import { ProcessFiles } from "../../helpers/processFiles.js";
import { Cache } from "../../helpers/cache.js";

/**
 * Updates the user's profile with the provided data.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.file - The uploaded file for the user's profile picture.
 * @param {Object} req.body - The updated profile data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A Promise that resolves when the profile has been updated and the response has been sent.
 */
export async function updateProfile(req, res, next) {
  try {
    const { uploadUrl } = ProcessFiles.profile(req.file);
    const validatedData = await updateProfileSchema.validateAsync(req.body);
    const updatedProfile = await repository.update(
      req.userId,
      uploadUrl,
      validatedData
    );
    await Cache.set(`profile:${req.userId}`, updatedProfile);
    return respond(res, 200, "Profile updated successfully", {
      profile: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the public profile for the specified user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.userId - The ID of the user whose profile should be retrieved.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A Promise that resolves when the profile has been retrieved and sent in the response.
 */
export async function getPublicProfile(req, res, next) {
  try {
    const params = await fetchUserSchema.validateAsync(req.params);
    const profile = await repository.fetchPublicProfile(params.userId);
    if (!profile) return respond(res, 404, "Profile not found");
    return respond(res, 200, "Profile retrieved successfully", { profile });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the private profile for the current user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.userId - The ID of the user whose private profile should be retrieved.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A Promise that resolves when the profile has been retrieved and sent in the response.
 */
export async function getPrivateProfile(req, res, next) {
  try {
    const cachedProfile = await Cache.get(`profile:${req.userId}`);
    if (cachedProfile)
      return respond(
        res,
        200,
        "Profile retrieved successfully",
        cachedProfile
      );
    const profile = await repository.fetchPrivateProfile(req.userId);
    await Cache.set(`profile:${req.userId}`, profile);
    return respond(res, 200, "Profile retrieved successfully", { profile });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes the user account with the specified userId.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The ID of the user to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the user has been deleted.
 */
export async function deleteAccount(req, res, next) {
  try {
    const params = await fetchUserSchema.validateAsync(req.params);
    const user = await repository.deleteUserById(params.userId);
    if (!user) return respond(res, 404, "User not found");
    await Cache.delete(`profile:${req.userId}`);
    return respond(res, 200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
}
