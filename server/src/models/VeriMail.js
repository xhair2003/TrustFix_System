module.exports = (sequelize, DataTypes) => {
    const VeriMail = sequelize.define('VeriMail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    VeriMail.associate = (models) => {
        // Define the relationship
        VeriMail.belongsTo(models.User, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'user'
        });
    };

    return VeriMail;
}; 