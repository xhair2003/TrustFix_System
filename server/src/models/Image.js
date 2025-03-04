module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        request_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imgUrlList: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Image.associate = (models) => {
        // Define the relationship
        Image.belongsTo(models.Request, {
            foreignKey: 'request_id',
            as: 'request'
        });
    };

    return Image;
}; 