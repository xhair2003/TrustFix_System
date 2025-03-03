module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true
    });

    Service.associate = (models) => {
        // Define the relationship
        Service.hasMany(models.ServiceIndustry, {
            foreignKey: 'service_id',
            as: 'serviceIndustries'
        });
    };

    return Service;
}; 