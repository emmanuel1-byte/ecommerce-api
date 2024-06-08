
export const Rating = sequelize.define('Rating', {
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

    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true })


export const ProductRating = sequelize.define('ProductRating', {
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    rate_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
})