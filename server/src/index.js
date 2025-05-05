// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { createServer } = require('http');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// // Khởi tạo express app
// const app = express();
// require('./processors/monthlyFeeProcessor')(app.get('io')); // If monthlyFeeProcessor also needs io
// require('./processors/checkCommentsForViolations')(app.get('io')); // Pass io to checkCommentsForViolations
// const { Server } = require('socket.io');
// const jwt = require('jsonwebtoken');
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: process.env.CLIENT_URL || 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });
// // WebSocket middleware
// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//         console.error('Authentication error: No token provided');
//         return next(new Error('Authentication error: No token provided'));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
//         socket.user = decoded;
//         socket.join(decoded.id.toString()); // Tham gia room dựa trên user ID
//         console.log(`User ${decoded.id} authenticated and joined room`);
//         next();
//     } catch (error) {
//         console.error('JWT verification failed:', error.message);
//         next(new Error('Authentication error: Invalid token'));
//     }
// });

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });
// // Lưu io vào app để dùng trong controller
// app.set('io', io);

// // Request logging middleware
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
// });

// // Basic middleware setup
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parsing middleware - phải đặt trước các route
// app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// // Set response headers
// app.use((req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     next();
// });

// // Debug middleware - log request body
// app.use((req, res, next) => {
//     if (req.body && Object.keys(req.body).length > 0) {
//         // console.log('Request Body:', req.body);
//         // console.log('Content-Type:', req.headers['content-type']);
//     }
//     next();
// });

// // Routes
// const authenRoutes = require("./routes/AuthenRoutes");
// app.use("/api/authen", authenRoutes);

// const repairmanRoutes = require("./routes/RepairmanRoutes");
// app.use("/api/repairman", repairmanRoutes);

// const adminRoutes = require("./routes/AdminRoutes");
// app.use("/api/admin", adminRoutes);

// const customerRoutes = require("./routes/CustomerRoutes");
// app.use("/api/customer", customerRoutes);

// const paymentRoutes = require("./routes/PaymentRoutes");

// app.use("/api", paymentRoutes);


// // Test route at root level
// app.get('/', (req, res) => {
//     res.json({ message: 'API is working' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         EC: 0,
//         EM: "Đã có lỗi xảy ra!",
//         DT: process.env.NODE_ENV === 'development' ? err.message : {}
//     });
// });

// // MongoDB connection
// const connectDB = async () => {
//     try {
//         if (!process.env.MONGODB_URL) {
//             throw new Error('MONGODB_URL is not defined in environment variables');
//         }

//         await mongoose.connect(process.env.MONGODB_URL, {
//             autoIndex: true
//         });

//         console.log('MongoDB Connected Successfully to database:', mongoose.connection.db.databaseName);
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//         process.exit(1);
//     }
// };

// // Start server
// const startServer = async () => {
//     try {
//         await connectDB();
//         const port = process.env.PORT || 8080;
//         httpServer.listen(port, () => {
//             console.log(`Server is running on port ${port}`);
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     }
// };

// startServer();


// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Khởi tạo express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// WebSocket middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.error('Authentication error: No token provided');
        return next(new Error('Authentication error: No token provided'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        socket.user = decoded;
        socket.join(decoded.id.toString());
        console.log(`User ${decoded.id} authenticated and joined room`);
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Lưu io vào app
app.set('io', io);

// Require cron jobs, passing io
require('./processors/checkCommentsForViolations')(app.get('io'));
require('./processors/monthlyFeeProcessor')(app.get('io'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Basic middleware setup
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set response headers
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Debug middleware - log request body
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        // console.log('Request Body:', req.body);
        // console.log('Content-Type:', req.headers['content-type']);
    }
    next();
});

// Routes
const authenRoutes = require('./routes/AuthenRoutes');
app.use('/api/authen', authenRoutes);
const repairmanRoutes = require('./routes/RepairmanRoutes');
app.use('/api/repairman', repairmanRoutes);
const adminRoutes = require('./routes/AdminRoutes');
app.use('/api/admin', adminRoutes);
const customerRoutes = require('./routes/CustomerRoutes');
app.use('/api/customer', customerRoutes);
const paymentRoutes = require('./routes/PaymentRoutes');
app.use('/api', paymentRoutes);
const chatRoutes = require('./routes/MessageRoutes');
app.use('/api/chat', chatRoutes);

// Test route at root level
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        EC: 0,
        EM: 'Đã có lỗi xảy ra!',
        DT: process.env.NODE_ENV === 'development' ? err.message : {},
    });
});

// MongoDB connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URL, { autoIndex: true });
        console.log('MongoDB Connected Successfully to database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 8080;
        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();