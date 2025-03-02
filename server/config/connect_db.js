const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,  // Tắt hiển thị SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Không import models trong connect_db để tránh circular dependency
const connectDB = async () => {
    try {
        // Xác thực kết nối
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Các model sẽ được đồng bộ sau khi import trong index.js
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // Thoát process nếu không kết nối được database
    }
};

module.exports = {
    connectDB,
    sequelize
};
