import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { User } from "../auth/model.js";
import { Product } from "../product/model.js";
import { randomUUID } from 'crypto'

export const Cart = sequelize.define(
  "Cart",
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

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

User.belongsToMany(Product, {
  through: Cart,
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Product.belongsToMany(User, {
  through: Cart,
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
