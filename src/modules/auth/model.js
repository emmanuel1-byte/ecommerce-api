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



/**
 * Hashes the user's password before creating a new user record.
 * This hook is executed automatically before a new user record is created.
 * It ensures the password is securely stored by hashing it with bcrypt.
 */
User.beforeCreate(async function (user, options) {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    logger.error(err.message);
  }
});


/**
 * Hashes the user's password before updating it in the database.
 * This hook is executed automatically before a user record is updated.
 * It ensures the password is securely stored by hashing it with bcrypt.
 */
User.beforeUpdate(async function (user, options) {
  try {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  } catch (err) {
    logger.error(err.message);
  }
});





/**
 * Establishes a one-to-one relationship between the User and Token models.
 * When a User is deleted, the associated Token record will also be deleted.
 * When a Token is deleted, the associated User record will also be deleted.
 */
User.hasOne(Token, { foreignKey: "userId", onDelete: "CASCADE" }),
  Token.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

