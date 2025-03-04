require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { connectDB } = require('./models');
const cookieParser = require('cookie-parser');

// Khởi tạo express app
const app = express();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Basic middleware setup
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware - phải đặt trước các route
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Set response headers
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Debug middleware - log request body
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
    }
    next();
});

// Routes
const authenRoutes = require("./routes/AuthenRoutes");
app.use("/api/authen", authenRoutes);

// Test route at root level
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        EC: 0,
        EM: "Đã có lỗi xảy ra!",
        DT: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

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
