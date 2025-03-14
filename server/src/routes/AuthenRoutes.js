const express = require("express");
const router = express.Router();
const AuthenController = require("../controllers/AuthenController");
const AuthMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload_IMG");
// Public routes - no authentication needed
router.post("/register", AuthenController.initRegister);
router.post("/verify-register", AuthenController.verifyRegister);

router.get("/get-role", AuthMiddleware.verifyToken, AuthenController.getRole);
router.post("/login", AuthenController.login);
router.post("/refresh-token", AuthenController.refreshToken);
router.post("/logout", AuthMiddleware.verifyToken, AuthenController.logout);
router.post("/change-password", AuthMiddleware.verifyToken, AuthenController.changePassword);

// Forgot password routes
router.post("/forgot-password", AuthenController.forgotPassword);
router.post("/verify-otp", AuthenController.verifyOTP);
router.post("/reset-password", AuthenController.resetPassword);

// Protected routes - require authentication
// Example route accessible only to admins
router.get("/admin-only", AuthMiddleware.verifyAdmin, (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Admin route accessed successfully",
        DT: {}
    });
});

// Example route accessible to both repairmen and admins
router.get("/repairman-admin", AuthMiddleware.verifyAdminOrRepairman, (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "Repairman/Admin route accessed successfully",
        DT: {}
    });
});

// Example route accessible to all authenticated users (any role)
router.get("/user-info", AuthMiddleware.verifyToken, (req, res) => {
    res.status(200).json({
        EC: 1,
        EM: "User info retrieved successfully",
        DT: {
            user: req.user
        }
    });
});



// router.post("/update-profile",upload.single("image") , AuthenController.updateInformation);
module.exports = router;

