import multer from 'multer'
import { respond } from '../utils/response.js';

const storage = multer.memoryStorage()

/**
 * Middleware function to handle file size limit errors.
 *
 * This middleware function is used to handle errors that occur when the uploaded file size exceeds the maximum limit. If the error code is "LIMIT_FILE_SIZE", it returns a 400 Bad Request response with a JSON payload indicating the error. Otherwise, it calls the next middleware function.
 *
 * @param {Error} err - The error object containing information about the file size limit error.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to be called.
 */
export async function handlefileSizeLimitError(err, req, res, next) {
    try {
        if (err.code === "LIMIT_FILE_SIZE")
            return respond(res, 400, "File size limit exceeded")
        next();
    } catch (err) {
        next(err)
    }
}

/**
 * Middleware function to filter uploaded files based on allowed file extensions.
 *
 * This middleware function is used to validate the file extension of an uploaded file.
 * It checks if the file extension is one of the allowed extensions (currently "jpeg" and "png").
 * If the file extension is not allowed, it responds with a 415 Unsupported Media Type error.
 * If the file extension is allowed, it calls the next middleware function.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export function fileFilter(req, res, next) {
    try {
        const allowedExtensions = ["jpeg", "png"]
        const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return respond(res, 415, 'Invalid file tyoe')
        }
        next()
    } catch (err) {
        next(err)
    }
}


/**
 * Configures the Multer middleware for file uploads.
 *
 * This middleware is responsible for handling file uploads using the Multer library.
 * It sets up the storage configuration, file filter, and size limit for the uploaded files.
 *
 * The uploaded files will be stored using the configured storage settings, and the
 * `fileFilter` function will be used to validate the file type. The size limit is
 * set to 5MB.
 */

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

