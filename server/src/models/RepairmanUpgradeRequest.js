module.exports = (sequelize, DataTypes) => {
    const RepairmanUpgradeRequest = sequelize.define('RepairmanUpgradeRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        serviceIndustry_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        typePaper: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imgPaper: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    RepairmanUpgradeRequest.associate = (models) => {
        // Define the relationships
        RepairmanUpgradeRequest.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        RepairmanUpgradeRequest.belongsTo(models.ServiceIndustry, {
            foreignKey: 'serviceIndustry_id',
            as: 'serviceIndustry'
        });
    };

    return RepairmanUpgradeRequest;
}; 