import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { randomUUID } from "crypto";

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

    product_id: {
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

/**
 * Establishes a one-to-many relationship between the `User` and `Rating` models.
 * - `User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" })`: Defines that a `User` can have many `Rating` instances, and the `user_id` foreign key will be used to link them. When a `User` is deleted, any associated `Rating` instances will also be deleted.
 * - `Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" })`: Defines that a `Rating` belongs to a single `User`, and the `user_id` foreign key will be used to link them. When a `Rating` is deleted, the associated `User` will also be deleted.
 */

User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

/**
 * Establishes a one-to-many relationship between the `Product` and `Rating` models.
 * - `Product.hasMany(Rating, { foreignKey: "product_id", onDelete: "CASCADE" })`: Defines that a `Product` can have many `Rating` instances, and the `product_id` foreign key will be used to link them. When a `Product` is deleted, any associated `Rating` instances will also be deleted.
 * - `Rating.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" })`: Defines that a `Rating` belongs to a single `Product`, and the `product_id` foreign key will be used to link them. When a `Rating` is deleted, the associated `Product` will also be deleted.
 */
Product.hasMany(Rating, { foreignKey: "product_id", onDelete: "CASCADE" });
Rating.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
