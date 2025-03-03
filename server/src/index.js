require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { connectDB } = require('../config/connect_db');



const startServer = async () => {
    try {
        // Khởi tạo express app
        const app = express();

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    
        // Kết nối database
        await connectDB();

        // Import và đồng bộ các model sau khi kết nối thành công
        const models = require('./models');
        // await models.syncModels();
        console.log('All database tables have been created or updated');


     
        


        
        // Khởi tạo server
        const port = process.env.PORT || 8080;
        const httpServer = createServer(app);

        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
