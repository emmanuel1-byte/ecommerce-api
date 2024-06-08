import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import { User } from "../auth/model.js";
import { Category } from "../category/model.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    thumbnail_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    product_images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

/**
 * Defines the relationship between the User and Product models.
 * A User can have many Products, and each Product belongs to a single User.
 * When a User is deleted, all associated Products will also be deleted.
 */
User.hasMany(Product, { foreignKey: "vendor_id", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "vendor_id", onDelete: "CASCADE" });

/**
 * Defines the many-to-many relationship between Product and Category models.
 * The `ProductCategory` model is used as the junction table to connect the two models.
 * When a Product or Category is deleted, the associated records in the junction table will also be deleted.
 */

/**
 * Defines the many-to-many relationship between Product and Category models.
 * The `ProductCategory` model is used as the junction table to connect the two models.
 * When a Product is deleted, the associated records in the junction table will also be deleted.
 */
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

/**
 * Defines the many-to-many relationship between Category and Product models.
 * The `ProductCategory` model is used as the junction table to connect the two models.
 * When a Category or Product is deleted, the associated records in the junction table will also be deleted.
 */
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
