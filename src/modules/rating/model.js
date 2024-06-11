import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { randomUUID } from 'crypto'

export const Rating = sequelize.define(
  "Rating",
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

    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const ProductRating = sequelize.define("ProductRating", {
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  rate_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, { timestamps: true, freezeTableName: true });

/**
 * Establishes a one-to-many relationship between the User and Rating models.
 * - A User can have many Ratings.
 * - When a User is deleted, all associated Ratings will also be deleted.
 */
User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });


/**
 * Establishes a many-to-many relationship between the Product and Rating models.
 * - A Product can have many Ratings.
 * - A Rating can be associated with many Products.
 * - When a Product or Rating is deleted, all associated ProductRating records will also be deleted.
 */
Product.belongsToMany(Rating, {
  through: ProductRating,
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

Rating.belongsToMany(Product, {
  through: ProductRating,
  foreignKey: "rate_id",
  onDelete: "CASCADE",
});
