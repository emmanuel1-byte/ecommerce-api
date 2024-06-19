import { respond } from "../../utils/response.js";
import { repository } from "./repository.js";
import authRespository from "../auth/repository.js";
import {
  createUserSchema,
  fetchUserSchema,
  paginationSchema,
  updateUserSchema,
} from "./schema.js";

/**
 * Creates a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the user creation request.
 * @throws {Error} - Any error that occurs during user creation.
 */
export async function createUser(req, res, next) {
  try {
    const validatedData = await createUserSchema.validateAsync(req.body);
    await authRespository.create(validatedData);
    return respond(res, 201, "User created succesfully");
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a paginated list of users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the get users request.
 * @throws {Error} - Any error that occurs during user retrieval.
 */
export async function getPaginatedListOfUsers(req, res, next) {
  try {
    const params = await paginationSchema.validateAsync(req.query);
    const { page, limit } = params;
    const { user, pagination } = await repository.fetchAllUser(page, limit);
    return respond(res, 200, "User's retrieved", { user, pagination });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates a user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the update user request.
 * @throws {Error} - Any error that occurs during user update.
 */
export async function updateUser(req, res, next) {
  try {
    const params = await fetchUserSchema.validateAsync(req.params);
    const existingUser = await repository.fetchUserById(params.userId);
    if (!existingUser) return respond(res, 404, "User not found");
    const validatedData = await updateUserSchema.validateAsync(req.body);
    const updatedUser = await repository.update(existingUser.id, validatedData);
    return respond(res, 201, "User updated succesfully", { user: updatedUser });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a user by their ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The ID of the user to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user has been deleted.
 */
export async function deleteUser(req, res, next) {
  try {
    const params = await fetchUserSchema.validateAsync(req.params);
    const existingUser = repository.fetchUserById(params.userId);
    if (!existingUser) return respond(res, 404, "User not found");
    await repository.deleteById(existingUser.id);
    return respond(res, 200, "User deleted succesfully");
  } catch (err) {
    next(err);
  }
}
