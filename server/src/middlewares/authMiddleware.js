const jwt = require('jsonwebtoken');
const models = require('../models');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "TrustFix_System_jwt_secret_key_2024";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            EC: 0,
            EM: "Không có token xác thực!"
        });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({
            EC: 0,
            EM: "Token không hợp lệ hoặc đã hết hạn!"
        });
    }
};

// Middleware for role-based authorization
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({
                EC: 0,
                EM: "Không có quyền truy cập!"
            });
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
        
        if (!hasRole) {
            return res.status(403).json({
                EC: 0,
                EM: "Bạn không có quyền thực hiện hành động này!"
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    authorize
}; 