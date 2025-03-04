module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
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
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        imgAvt: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['phone']
            }
        ]
    });

    User.associate = (models) => {
        User.hasMany(models.Role, { 
            foreignKey: 'user_id',
            as: 'roles',
            onDelete: 'CASCADE'
        });
        
        User.hasOne(models.Wallet, { 
            foreignKey: 'user_id',
            as: 'wallet',
            onDelete: 'CASCADE'
        });
        
        User.hasOne(models.Vip, { 
            foreignKey: 'user_id',
            as: 'vip',
            onDelete: 'CASCADE'
        });
        
        User.hasMany(models.Request, { 
            foreignKey: 'user_id',
            as: 'requests',
            onDelete: 'CASCADE'
        });
        
        User.hasMany(models.RepairmanUpgradeRequest, { 
            foreignKey: 'user_id',
            as: 'repairmanUpgradeRequests',
            onDelete: 'CASCADE'
        });
        
        User.hasOne(models.VeriMail, { 
            foreignKey: 'user_id',
            as: 'veriMail',
            onDelete: 'CASCADE'
        });
    };

    return User;
};