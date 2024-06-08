import { v2 as cloudinary } from "cloudinary";
import config from "../../utils/config.js";
import { logger } from "../../utils/logger.js";
import { Readable } from "stream";

/**
 * Configures the Cloudinary service with the provided cloud name, API key, and API secret.
 * This configuration is used throughout the application when interacting with the Cloudinary API.
 */

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
});

/**
 * Uploads a file to Cloudinary.
 *
 * @param {Buffer} buffer - The file data as a Buffer.
 * @returns {Promise<Object>} - The result of the Cloudinary upload operation.
 */
export async function cloudinaryUpload(buffers) {
  try {
    const promises = buffers.map((buffer) => {
      return new Promise((resolve, reject) => {
        const transFormStream = cloudinary.uploader.upload_stream(
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
        const readableStream = Readable.from([buffer]);
        readableStream.pipe(transFormStream);
      });
    });
    return Promise.all(promises);
  } catch (err) {
    logger.error(err.stack);
  }
}
