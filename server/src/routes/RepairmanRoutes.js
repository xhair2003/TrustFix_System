const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const RepairmanController = require("../controllers/RepairmanController");
const upload = require("../middlewares/upload_IMG");

const multer = require("multer");
const { route } = require("./CustomerRoutes");
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

router.get("/process-monthly-fee", AuthMiddleware.verifyRepairman, RepairmanController.processMonthlyFee);

router.post("/deal-price/:requestId", AuthMiddleware.verifyRepairman, RepairmanController.dealPrice);
router.get("/viewRequest", AuthMiddleware.verifyRepairman, RepairmanController.viewRequest);
router.get("/viewCustomerRequest", AuthMiddleware.verifyRepairman, RepairmanController.viewCustomerRequest);
//
router.post("/buy-vip-package", AuthMiddleware.verifyRepairman, RepairmanController.registerVipPackage);


//add 2nd certificate
router.post("/add-second-certificate", AuthMiddleware.verifyRepairman, upload.array("img2ndCertificate", 5), RepairmanController.addSecondCertificate);

router.put('/confirmRequest', AuthMiddleware.verifyRepairman, RepairmanController.confirmRequest);
router.get('/revenue-by-time', AuthMiddleware.verifyRepairman, RepairmanController.getRepairmanRevenueByTime);


router.get("/view-status-month", AuthMiddleware.verifyRepairman, RepairmanController.getRequestStatusByMonth);

router.get("/view-status-year", AuthMiddleware.verifyRepairman, RepairmanController.getRequestStatusByYear);

// api để xuất dữ liệu tất cả thống kê của dashboard thợ ra file excel
router.get("/all-stats", AuthMiddleware.verifyRepairman, RepairmanController.getAllRepairmanStats);

module.exports = router;