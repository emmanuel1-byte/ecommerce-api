import { cloudinaryUpload } from "../../services/upload/cloudinary.js";
import { respond } from "../../utils/response.js";
import repository from "./repository.js";
import {
  createProductSchema,
  getProductSchema,
  paginationSchema,
  productSearchSchema,
  updateProductSchema,
} from "./schema.js";

/**
 * Creates a new product in the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the product data.
 * @param {Object[]} req.files - The uploaded files, including the thumbnail and product images.
 * @param {number} req.userId - The ID of the user creating the product.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product is created.
 */
export async function createProduct(req, res, next) {
  try {
    const validatedData = await createProductSchema.validateAsync(req.body);
    const thumbnailBuffer = req.files["thumbnail"][0].buffer;
    const productImagesBuffer = req.files["product_images"].map(
      (file) => file.buffer
    );
    const [thumbnail, ...producImages] = await cloudinaryUpload([
      thumbnailBuffer,
      ...productImagesBuffer,
    ]);
    const product = await repository.create(
      validatedData,
      req.userId,
      thumbnail,
      producImages
    );
    return respond(res, 201, "Product created succesfully", { product });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a product by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {number} req.params.productId - The ID of the product to retrieve.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getProduct(req, res, next) {
  try {
    const params = await getProductSchema.validateAsync(req.params);
    const product = await repository.fetchProductById(params.productId);
    if (!product) return respond(res, 404, "Product not found");
    return respond(res, 200, "Product found", { product });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a paginated list of products.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} req.query.page - The page number for pagination.
 * @param {number} req.query.limit - The number of products to retrieve per page.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getPaginatedListOfProducts(req, res, next) {
  try {
    const params = await paginationSchema.validateAsync(req.query);
    const { page, limit } = params;
    const { product, pagination } = await repository.fetchAllProducts(
      page,
      limit
    );
    return respond(res, 200, "Product retrievd successfully", {
      product,
      pagination,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a list of products based on a search query.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters for the search.
 * @param {string} req.query.query - The search query to use.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function searchProduct(req, res, next) {
  try {
    const params = await productSearchSchema.validateAsync(req.query);
    const product = await repository.fetchProductByKeyword(params.query);
    if (product.length === 0) return respond(res, 404, "Product not found");
    return respond(res, 200, "Product found", { product });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates a product in the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the updated product data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function updateProduct(req, res, next) {
  try {
    const validatedData = await updateProductSchema.validateAsync(req.body);
    let thumbnailBuffer, productImagesBuffer;
    if (req.files && req.files.thumbnail && req.files.product_images) {
      thumbnailBuffer = req.files["thumbnail"][0].buffer;
      productImagesBuffer = req.files["product_images"].map(
        (file) => file.buffer
      );
      const [thumbnail, ...producImages] = await cloudinaryUpload([
        thumbnailBuffer,
        ...productImagesBuffer,
      ]);
      const product = await repository.update(
        validatedData,
        req.userId,
        thumbnail,
        producImages
      );
      return respond(res, 200, "Product successfully updated", { product });
    }
    const product = await repository.update(validatedData, req.userId);
    return respond(res, 200, "Product successfully updated", { product });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a product from the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the product ID to delete.
 * @param {string} req.body.productId - The ID of the product to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function deleteProduct(req, res, next) {
  try {
    const params = await getProductSchema.validateAsync(req.body);
    const product = await repository.deleteById(params.productId);
    if (!product) return respond(res, 404, "Product not found");
    return respond(res, 200, "Product deleted succesfully");
  } catch (err) {
    next(err);
  }
}
