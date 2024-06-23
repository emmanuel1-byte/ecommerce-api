import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";

export const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    shipping_details: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    order_status: {
      type: DataTypes.ENUM,
      values: ["pending", "processing", "completed", "cancelled"],
      defaultValue: "pending",
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    order_id: {
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
 * Establishes a one-to-many relationship between the User and Order models.
 * - A User can have many Orders.
 * - When a User is deleted, all their associated Orders will also be deleted.
 */
User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

/**
 * Establishes a many-to-many relationship between the Product and Order models through the OrderItem model.
 * - A Product can be associated with many Orders.
 * - An Order can be associated with many Products.
 * - The association is managed through the OrderItem model, which acts as the join table.
 */
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "product_id" });
Order.belongsToMany(Product, { through: OrderItem, foreignKey: "order_id" });
