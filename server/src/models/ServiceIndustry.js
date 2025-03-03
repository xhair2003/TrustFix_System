module.exports = (sequelize, DataTypes) => {
    const ServiceIndustry = sequelize.define('ServiceIndustry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    ServiceIndustry.associate = (models) => {
        // Define the relationship
        ServiceIndustry.belongsTo(models.Service, {
            foreignKey: 'service_id',
            as: 'service'
        });

        ServiceIndustry.hasMany(models.Request, {
            foreignKey: 'serviceIndustry_id',
            as: 'requests'
        });

        ServiceIndustry.hasMany(models.RepairmanUpgradeRequest, {
            foreignKey: 'serviceIndustry_id',
            as: 'repairmanUpgradeRequests'
        });
    };

    return ServiceIndustry;
}; 