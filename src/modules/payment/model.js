import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import { User } from "../auth/model.js";

export const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

/**
 * Establishes a one-to-many relationship between the `User` and `Payment` models.
 * - `User.hasMany(Payment, { foreignKey: "user_id", onDelete: "CASCADE" })`: Defines a one-to-many relationship where a single `User` can have multiple `Payment` records. The `user_id` foreign key is used to link the `Payment` records to the `User` they belong to. When a `User` is deleted, all associated `Payment` records will also be deleted.
 * - `Payment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" })`: Defines the inverse relationship, where a single `Payment` record belongs to a `User`. This ensures the foreign key relationship is properly set up in both directions.
 */
User.hasMany(Payment, { foreignKey: "user_id", onDelete: "CASCADE" });
Payment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
