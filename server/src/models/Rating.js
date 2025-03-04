module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
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
        comment: {
            type: DataTypes.STRING
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    }, {
        timestamps: true
    });

    Rating.associate = (models) => {
        // Define the relationship
        Rating.belongsTo(models.Request, {
            foreignKey: 'request_id',
            as: 'request'
        });
    };

    return Rating;
}; 