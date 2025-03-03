require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const connectDB = require('../config/connect_db');
const bodyParser = require('body-parser');

// Khởi tạo express app
const app = express();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware to capture the raw body
app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        req.rawBody = data;
        next();
    });
});

// Middleware
app.use(cors());

// Custom middleware to handle text/plain content type that contains JSON
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'text/plain' && req.rawBody) {
        try {
            req.body = JSON.parse(req.rawBody);
            console.log("Successfully parsed text/plain as JSON:", req.body);
        } catch (e) {
            console.error("Failed to parse text/plain as JSON:", e);
        }
    }
    next();
});

// More explicit body parsing configuration
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Fallback to original Express parsers if bodyParser doesn't work
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
const authenRoutes = require("./routes/AuthenRoutes");

//api
app.use("/api/authen", authenRoutes);

// Test route at root level
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Test route for body parsing
app.post('/test', (req, res) => {
    console.log('Test body:', req.body);
    res.json({ 
        received: req.body, 
        contentType: req.headers['content-type'] 
    });
});

const startServer = async () => {
    try {
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
