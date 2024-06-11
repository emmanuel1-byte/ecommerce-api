import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from 'crypto'
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";

export const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  { timestamps: true, freezeTableName: true }
);

export const ProductReview = sequelize.define(
  "ProductReview",
  {
    review_id: {
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
 * Establishes a one-to-many relationship between the User and Review models.
 * - A User can have many Reviews, and a Review belongs to a single User.
 * - The `onDelete: 'CASCADE'` option ensures that when a User is deleted, all their associated Reviews are also deleted.
 */
User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

/**
 * Establishes a many-to-many relationship between the Product and Review models, using the ProductReview junction table.
 * - A Product can have many Reviews, and a Review can be associated with many Products.
 * - The `onDelete: 'CASCADE'` option ensures that when a Product or Review is deleted, the associated records in the ProductReview table are also deleted.
 */
Product.belongsToMany(Review, {
  through: ProductReview,
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Review.belongsToMany(Product, {
  through: ProductReview,
  foreignKey: "review_id",
  onDelete: "CASCADE",
});
