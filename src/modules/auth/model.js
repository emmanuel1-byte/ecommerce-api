import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { logger } from "../../utils/logger.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },

    role: {
      type: DataTypes.ENUM,
      values: ["User", "Seller", "Admin"],
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    account_status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },

    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiresIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true, indexes: [{ fields: ["token"] }] }
);

export const BlackList = sequelize.define(
  "BlackList",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => randomUUID(),
      primaryKey: true,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);


/** Hooks */
User.beforeCreate(async function (user, options) {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    logger.error(err.message);
  }
});





User.hasOne(Token, { foreignKey: "userId", onDelete: "CASCADE" }),
Token.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
