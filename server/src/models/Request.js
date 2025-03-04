module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
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
        description: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Request.associate = (models) => {
        // Define the relationships
        Request.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Request.belongsTo(models.ServiceIndustry, {
            foreignKey: 'serviceIndustry_id',
            as: 'serviceIndustry'
        });

        Request.hasOne(models.DuePrice, {
            foreignKey: 'request_id',
            as: 'duePrice'
        });

        Request.hasOne(models.Rating, {
            foreignKey: 'request_id',
            as: 'rating'
        });

        Request.hasOne(models.Address, {
            foreignKey: 'request_id',
            as: 'address'
        });

        Request.hasMany(models.Image, {
            foreignKey: 'request_id',
            as: 'images'
        });
    };

    return Request;
}; 