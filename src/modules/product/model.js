import { DataTypes } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { randomUUID } from 'crypto'


const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => randomUUID(),
        primaryKey: true,
        allowNull: false
    },

    product_image: {
        type: DataTypes.STRING,
        allowNull: false
    },

    product_images: {
        type: DataTypes.JSON,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true
        }
    },

    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    seller_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true })




export const ProductCategory = sequelize.define('ProductCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => randomUUID(),
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true })