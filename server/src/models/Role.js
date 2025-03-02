module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Role.associate = (models) => {
        // Define the relationship
        Role.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Role;
}; 