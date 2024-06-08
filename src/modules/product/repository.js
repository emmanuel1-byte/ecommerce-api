import { Op } from "sequelize";
import { logger } from "../../utils/logger.js";
import { Product, ProductCategory } from "./model.js";
import { sequelize } from "../../utils/database.js";

/**
 * Creates a new product with the provided data and associates it with the specified vendor and category.
 *
 * @param {Object} data - The product data to create.
 * @param {number} userId - The ID of the vendor creating the product.
 * @param {Object} thumbnail - The thumbnail image for the product.
 * @param {Object[]} productImages - The product images.
 * @returns {Promise<Product>} The created product.
 */
async function create(data, userId, thumbnail, productImages) {
  try {
    return await sequelize.transaction(async (t) => {
      const product = await Product.create(
        {
          vendor_id: userId,
          product_name: data.name,
          price: data.price,
          description: data.description,
          quantity: data.quantity,
          thumbnail_image: thumbnail?.url,
          product_images: productImages.map((file) => file?.url),
        },
        { transaction: t }
      );

      await ProductCategory.create(
        {
          product_id: product.id,
          category_id: data.categoryId,
        },
        { transaction: t }
      );
      return product;
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Updates an existing product with the provided data.
 *
 * @param {Object} data - The updated product data.
 * @param {number} userId - The ID of the vendor updating the product.
 * @param {Object} thumbnail - The updated thumbnail image for the product.
 * @param {Object[]} productImages - The updated product images.
 * @returns {Promise<Product[]>} The affected products.
 */
async function update(data, userId, thumbnail, productImages) {
  try {
    const [numberOfAffectedRoles, affectedRoles] = await Product.update(
      {
        product_name: data.name || sequelize.literal("product_name"),
        price: data.price || sequelize.literal("price"),
        description: data.description || sequelize.literal("description"),
        category_id: data.categoryId || sequelize.literal("category_id"),
        quantity: data.quantity || sequelize.literal("quantity"),
        thumbnail_image: thumbnail?.url || sequelize.literal("thumbnail_image"),
        product_images:
          productImages?.map((file) => file?.url) ||
          sequelize.literal("product_images"),
      },
      { where: { vendor_id: userId }, returning: true }
    );
    return affectedRoles;
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches a product by its unique identifier.
 *
 * @param {number} productId - The unique identifier of the product to fetch.
 * @returns {Promise<Product|null>} The product with the given ID, or null if not found.
 */
async function fetchProductById(productId) {
  try {
    return await Product.findByPk(productId);
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches all products with pagination.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of products to fetch per page.
 * @returns {Promise<{ product: Product[], pagination: { page: number, total: number, totalPages: number, total_item: number } }>} An object containing the fetched products and pagination information.
 */
async function fetchAllProducts(page, limit) {
  try {
    return {
      product: await Product.findAll({
        offset: (page - 1) * page,
        limit: limit,
      }),
      pagination: {
        page: page,
        total: limit,
        totalPages: Math.ceil((await Product.count()) / limit),
        total_item: await Product.count(),
      },
    };
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Fetches products by a given keyword.
 *
 * @param {string} keyword - The keyword to search for in the product names.
 * @returns {Promise<Product[]>} An array of products that match the keyword.
 */
async function fetchProductByKeyword(keyword) {
  try {
    return await Product.findAll({
      where: {
        product_name: {
          [Op.iLike]: `%${keyword}`,
        },
      },
    });
  } catch (err) {
    logger.error(err.stack);
  }
}



/**
 * Deletes a product by its ID.
 *
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<number>} The number of affected rows.
 */
async function deleteProductById(productId) {
  try {
    return await Product.destroy({ where: { id: productId }, force: true });
  } catch (err) {
    logger.error(err.stack);
  }
}

const repository = {
  create,
  update,
  fetchProductById,
  fetchAllProducts,
  deleteProductById,
  fetchProductByKeyword,
};

export default repository;
