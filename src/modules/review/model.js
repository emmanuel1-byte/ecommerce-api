



export const ProductReview = sequelize.define('ProductReview', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => randomUUID(),
        primaryKey: true,
        allowNull: false
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    review: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true })