module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
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
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        }
    }, {
        timestamps: true
    });

    Wallet.associate = (models) => {
        // Define the relationship
        Wallet.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Wallet.hasMany(models.Transaction, {
            foreignKey: 'wallet_id',
            as: 'transactions'
        });
    };

    return Wallet;
}; 