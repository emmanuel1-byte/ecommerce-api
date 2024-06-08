import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import { getUserSchema, updateProfileSchema } from "./schema.js";
import { cloudinaryUpload } from "../../services/upload/cloudinary.js";

/**
 * Updates the user's profile with the provided data.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.file - The uploaded profile picture file.
 * @param {Object} req.body - The profile data to be updated.
 * @param {number} req.userId - The ID of the user whose profile is being updated.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the profile has been updated.
 */
export async function updateProfile(req, res, next) {
  try {
    let uploadToCloudinary;
    if (req.file) {
      uploadToCloudinary = await cloudinaryUpload(req.file.buffer);
    }
    const validatedData = await updateProfileSchema.validateAsync(req.body);
    const profile = await repository.updateProfile(
      req.userId,
      uploadToCloudinary?.url,
      validatedData
    );
    return respond(res, 200, "Profile updated successfully", { profile });
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
export async function viewPublicProfile(req, res, next) {
  try {
    const params = await getUserSchema.validateAsync(req.params);
    const profile = await repository.findProfile(params.userId);
    if (!profile) return respond(res, 404, "Profile not found");
    return respond(res, 200, "Profile retrieved successfully", { profile });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the private profile of the user with the given ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {number} req.userId - The ID of the user whose profile should be retrieved.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A promise that resolves when the profile has been retrieved and sent in the response.
 */
export async function viewPrivateProfile(req, res, next) {
  try {
    const profile = await repository.findProfile(req.userId);
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
    const params = await getUserSchema.validateAsync(req.params);
    const user = await repository.deleteAccount(params.userId);
    if (!user) return respond(res, 404, "User not found");
    return respond(res, 200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
}
