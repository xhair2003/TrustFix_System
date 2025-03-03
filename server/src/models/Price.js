module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define('Price', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        duePrice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        priceToPay: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Price.associate = (models) => {
        // Define the relationship
        Price.belongsTo(models.DuePrice, {
            foreignKey: 'duePrice_id',
            as: 'duePrice'
        });
    };

    return Price;
}; 