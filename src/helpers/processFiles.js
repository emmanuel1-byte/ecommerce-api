import { logger } from "../utils/logger.js";

/**
 * Provides methods for processing files, including uploading thumbnails and product images to Cloudinary.
 */
export class ProcessFiles {
  static async product(files) {
    try {
      if (files && files.thumbnail && files.product_images) {
        const thumbnailBuffer = files["thumbnail"][0].buffer;
        const productImagesBuffer = files["product_images"].map(
          (file) => file.buffer
        );
        const [thumbnail, ...producImages] = await cloudinaryUpload([
          thumbnailBuffer,
          ...productImagesBuffer,
        ]);
        return { thumbnail, producImages };
      }
      return {};
    } catch (err) {
      logger.error(err.stack);
    }
  }

  static async profile(file) {
    try {
      if (file) {
        const uploadToCloudinary = await cloudinaryUpload(req.file.buffer);
        return { uploadUrl: uploadToCloudinary.url };
      }
      return {};
    } catch (err) {
      logger.error(err.stack);
    }
  }
}
