module.exports = (sequelize, DataTypes) => {
    const Vip = sequelize.define('Vip', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Vip.associate = (models) => {
        // Define the relationship
        Vip.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Vip;
}; 