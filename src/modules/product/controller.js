import { Cache } from "../../helpers/cache.js";
import { ProcessFiles } from "../../helpers/processFiles.js";
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
    const { thumbnailUrl, producImagesUrl } = await ProcessFiles.product(
      req.files
    );
    const newProduct = await repository.create(
      req.userId,
      thumbnailUrl,
      producImagesUrl,
      validatedData
    );
    await Cache.set(`product:${newProduct.id}`, newProduct);
    return respond(res, 201, "Product created succesfully", {
      product: newProduct,
    });
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
    const cachedProducts = await Cache.get("products");
    if (cachedProducts) {
      return respond(res, 200, "Product retrievd successfully", {
        cachedProducts,
      });
    }
    const { product, pagination } = await repository.fetchAllProducts(
      page,
      limit
    );
    await Cache.set("products", { product, pagination });
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
    const params = await getProductSchema.validateAsync(req.params);
    const validatedData = await updateProductSchema.validateAsync(req.body);
    const existingProduct = await repository.fetchProductById(params.productId);
    if (!existingProduct) return respond(res, 404, "Product not found");
    const { thumbnail, producImages } = await ProcessFiles.product(req.files);
    const updatedProduct = await repository.update(
      existingProduct.id,
      thumbnail,
      producImages,
      validatedData
    );
    await Cache.set(`product:${updatedProduct.id}`, updatedProduct);
    return respond(res, 200, "Product successfully updated", {
      product: updatedProduct,
    });
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
    await Cache.delete(`product:${product.id}`);
    return respond(res, 200, "Product deleted succesfully");
  } catch (err) {
    next(err);
  }
}
