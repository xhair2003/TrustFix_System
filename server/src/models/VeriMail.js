module.exports = (sequelize, DataTypes) => {
    const VeriMail = sequelize.define('VeriMail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true,
        indexes: [
            {
                fields: ['user_id']
            }
        ]
    });

    VeriMail.associate = (models) => {
        VeriMail.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return VeriMail;
}; 