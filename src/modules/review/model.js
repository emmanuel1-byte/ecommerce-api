import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database";

export const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const ProductReview = sequelize.define(
  "ProductReview",
  {
    rating_id: {
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
