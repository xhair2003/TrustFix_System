const express = require("express");
const router = express.Router();
const AuthenController = require("../controllers/AuthenController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Public routes - no authentication needed
router.post("/register", AuthenController.register);
router.post("/login", AuthenController.login);
router.post("/refresh-token", AuthenController.refreshToken);
router.post("/logout", AuthMiddleware.verifyToken, AuthenController.logout);

// Protected routes - require authentication
// Example route accessible only to admins
router.get("/admin-only", AuthMiddleware.verifyToken, AuthMiddleware.authorize("admin"), (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Admin access granted",
        DT: { message: "This is admin only content" }
    });
});

// Example route accessible to both repairmen and admins
router.get("/repairman-admin", AuthMiddleware.verifyToken, AuthMiddleware.authorize("repairman", "admin"), (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Repairman/Admin access granted",
        DT: { message: "This content is for repairmen and admins" }
    });
});

// Example route accessible to all authenticated users (any role)
router.get("/user-info", AuthMiddleware.verifyToken, (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "User info retrieved",
        DT: { user: req.user }
    });
});

module.exports = router;