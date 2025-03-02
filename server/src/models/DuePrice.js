module.exports = (sequelize, DataTypes) => {
    const DuePrice = sequelize.define('DuePrice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        request_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        minPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        maxPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        timestamps: true
    });

    DuePrice.associate = (models) => {
        // Define the relationship
        DuePrice.belongsTo(models.Request, {
            foreignKey: 'request_id',
            as: 'request'
        });

        DuePrice.hasOne(models.Price, {
            foreignKey: 'duePrice_id',
            as: 'price'
        });
    };

    return DuePrice;
}; 