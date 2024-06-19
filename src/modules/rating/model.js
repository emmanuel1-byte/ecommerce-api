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


User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

Product.hasMany(Rating, { foreignKey: "product_id", onDelete: "CASCADE" });
Rating.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
