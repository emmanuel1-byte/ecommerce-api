


export const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => randomUUID(),
        primaryKey: true,
        allowNull: false
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true })


export const CartProduct = sequelize.define('CartProduct', {
    cart_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    }

},{ timestamps: true, freezeTableName: true })