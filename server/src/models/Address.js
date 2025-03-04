module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
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
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false
        },
        detailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Address.associate = (models) => {
        // Define the relationship
        Address.belongsTo(models.Request, {
            foreignKey: 'request_id',
            as: 'request'
        });
    };

    return Address;
}; 