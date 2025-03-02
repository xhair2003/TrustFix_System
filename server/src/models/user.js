module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        imgAvt: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        address: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true
    });

    User.associate = (models) => {
        // Định nghĩa các mối quan hệ
        User.hasMany(models.Role, { foreignKey: 'user_id', as: 'roles' });
        User.hasOne(models.Wallet, { foreignKey: 'user_id', as: 'wallet' });
        User.hasOne(models.Vip, { foreignKey: 'user_id', as: 'vip' });
        User.hasMany(models.Request, { foreignKey: 'user_id', as: 'requests' });
        User.hasMany(models.RepairmanUpgradeRequest, { foreignKey: 'user_id', as: 'repairmanUpgradeRequests' });
        User.hasOne(models.VeriMail, { foreignKey: 'email', sourceKey: 'email', as: 'veriMail' });
    };

    return User;
};