const express = require("express");
const router = express.Router();
const { register, login, testBodyParser } = require("../controllers/AuthenController");
const { verifyToken, authorize } = require("../middlewares/authMiddleware");

// Public routes - no authentication needed
router.post("/register", register);
router.post("/login", login);
router.post("/test-body", testBodyParser);

// Protected routes - require authentication
// Example route accessible only to admins
router.get("/admin-only", verifyToken, authorize("admin"), (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Admin access granted",
        DT: { message: "This is admin only content" }
    });
});

// Example route accessible to both repairmen and admins
router.get("/repairman-admin", verifyToken, authorize("repairman", "admin"), (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Repairman/Admin access granted",
        DT: { message: "This content is for repairmen and admins" }
    });
});

// Example route accessible to all authenticated users (any role)
router.get("/user-info", verifyToken, (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "User info retrieved",
        DT: { user: req.user }
    });
});

module.exports = router;