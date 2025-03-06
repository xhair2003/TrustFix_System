const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const RepairmanController = require("../controllers/RepairmanController");


// Repairman upgrade request route - requires authentication
router.post("/repairman-upgrade-request", AuthMiddleware.verifyToken, RepairmanController.requestRepairmanUpgrade);
router.get("/list-vips",  AuthMiddleware.verifyToken, RepairmanController.getAllVips);

// Admin routes - require admin authentication
router.get("/admin/repairman-upgrade-requests/pending", AuthMiddleware.verifyAdmin, RepairmanController.getPendingUpgradeRequests);
router.put("/admin/repairman-upgrade-requests/:requestId/verify", AuthMiddleware.verifyAdmin, RepairmanController.verifyRepairmanUpgradeRequest);

module.exports = router;