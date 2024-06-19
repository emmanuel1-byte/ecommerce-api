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

    product_name: {
      type: DataTypes.STRING,
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

    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    thumbnail_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    product_images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

  },
  { timestamps: true, freezeTableName: true }
);


/**
 * Defines the relationships between the User, Product, and Category models.
 *
 * - A User can have many Products, where the `vendor_id` foreign key on the Product model references the User's primary key.
 *   When a User is deleted, all associated Products will also be deleted.
 *
 * - A Category can have many Products, where the `category_id` foreign key on the Product model references the Category's primary key.
 *   When a Category is deleted, all associated Products will also be deleted.
 */
User.hasMany(Product, { foreignKey: "vendor_id", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "vendor_id", onDelete: "CASCADE" });

Category.hasMany(Product, { foreignKey: "category_id", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });
