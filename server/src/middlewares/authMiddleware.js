const jwt = require('jsonwebtoken');
const models = require('../models');
const { User } = require('../models');

// Get JWT secret from environment variables
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY || "your_jwt_access_secret_key";

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                EC: 0,
                EM: "Bạn chưa đăng nhập!"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                EC: 0,
                EM: "Bạn chưa đăng nhập!"
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_ACCESS_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    EC: 0,
                    EM: "Token đã hết hạn!"
                });
            }
            return res.status(401).json({
                EC: 0,
                EM: "Token không hợp lệ!"
            });
        }
    },

    verifyAdmin: (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.role === "admin") {
                console.log("Admin verified");
                next();
            } else {
                res.status(403).json({
                    EC: 0,
                    EM: "Bạn không có quyền truy cập!"
                });
            }
        });
    },

    verifyRepairman: (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.role === "repairman") {
                next();
            } else {
                res.status(403).json({
                    EC: 0,
                    EM: "Bạn không có quyền truy cập!"
                });
            }
        });
    },

    verifyCustomer: (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.role === "customer") {
                next();
            } else {
                res.status(403).json({
                    EC: 0,
                    EM: "Bạn không có quyền truy cập!"
                });
            }
        });
    },

    verifyAdminOrRepairman: (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.role === "admin" || req.user.role === "repairman") {
                next();
            } else {
                res.status(403).json({
                    EC: 0,
                    EM: "Bạn không có quyền truy cập!"
                });
            }
        });
    }
};

module.exports = authMiddleware; 