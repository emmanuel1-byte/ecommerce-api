import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from "crypto";
import { User } from "../auth/model.js";


export const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => randomUUID(),
        primaryKey: true,
        allowNull: false
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    profile_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },

    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, { timestamps: true, freezeTableName: true })

/**
 * Establishes a one-to-one relationship between the `User` and `Profile` models, where each user has a single profile.
 * The `userId` foreign key is used to link the `Profile` model to the `User` model.
 * When a `User` instance is deleted, the associated `Profile` instance will also be deleted due to the `onDelete: 'CASCADE'` option.
 */
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' })
Profile.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })