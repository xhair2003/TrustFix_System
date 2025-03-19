const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const RepairmanController = require("../controllers/RepairmanController");
const upload = require("../middlewares/upload_IMG");
const uploads = require("../middlewares/upload_IMG");

// Get type of ServiceIndustry table
router.get("/get-type-service-industry", AuthMiddleware.verifyToken, RepairmanController.getTypeServiceIndustry);

// Repairman upgrade request route - requires authentication
router.post("/repairman-upgrade-request", AuthMiddleware.verifyToken, upload.fields([
    { name: 'imgCertificatePractice', maxCount: 2 },  // Tải lên 2 tệp cho imgCertificatePractice
    { name: 'imgCCCD', maxCount: 2 }                   // Tải lên 2 tệp cho imgCCCD
]), RepairmanController.requestRepairmanUpgrade);


router.get("/list-vips", AuthMiddleware.verifyRepairman, RepairmanController.getAllVips);


router.get("/get-status", AuthMiddleware.verifyRepairman, RepairmanController.getStatusRepairman);
router.put("/toggle-status", AuthMiddleware.verifyRepairman, RepairmanController.toggleStatusRepairman);


module.exports = router;