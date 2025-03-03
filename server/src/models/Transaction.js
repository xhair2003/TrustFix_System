module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wallet_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transactionType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING
        },
        balanceAfterTransaction: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Transaction.associate = (models) => {
        // Define the relationship
        Transaction.belongsTo(models.Wallet, {
            foreignKey: 'wallet_id',
            as: 'wallet'
        });
    };

    return Transaction;
}; 