const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/connect_db');

// Định nghĩa các model
const User = require('./user')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const Wallet = require('./Wallet')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const Vip = require('./Vip')(sequelize, DataTypes);
const Service = require('./Service')(sequelize, DataTypes);
const ServiceIndustry = require('./ServiceIndustry')(sequelize, DataTypes);
const Request = require('./Request')(sequelize, DataTypes);
const RepairmanUpgradeRequest = require('./RepairmanUpgradeRequest')(sequelize, DataTypes);
const DuePrice = require('./DuePrice')(sequelize, DataTypes);
const Price = require('./Price')(sequelize, DataTypes);
const Rating = require('./Rating')(sequelize, DataTypes);
const Address = require('./Address')(sequelize, DataTypes);
const Image = require('./Image')(sequelize, DataTypes);
const VeriMail = require('./VeriMail')(sequelize, DataTypes);

// Tập hợp tất cả các model
const models = {
    User,
    Role,
    Wallet,
    Transaction,
    Vip,
    Service,
    ServiceIndustry,
    Request,
    RepairmanUpgradeRequest,
    DuePrice,
    Price,
    Rating,
    Address,
    Image,
    VeriMail
};

// Thiết lập các mối quan hệ (associations)
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Đồng bộ tất cả các model với database
const syncModels = async () => {
    try {
        // Alter sync - this will update tables without dropping data
        await sequelize.sync({ 
            alter: true,
            logging: false 
        });
        console.log('Database synchronized successfully - tables preserved');
    } catch (error) {
        console.error('Failed to sync database:', error);
        throw error;
    }
};

// Thêm sequelize và Sequelize vào models để sử dụng nếu cần
models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.syncModels = syncModels;

module.exports = models; 