const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const CustomerController = require("../controllers/CustomerController");
const upload = require("../middlewares/upload_IMG");
const authMiddleware = require("../middlewares/authMiddleware");


router.get(
  "/depositeHistory",
  AuthMiddleware.verifyToken,
  CustomerController.getAllDepositeHistory
);

router.get(
  "/historyPayment",
  AuthMiddleware.verifyToken,
  CustomerController.getAllHistoryPayment
);

router.get(
  "/getBalance",
  AuthMiddleware.verifyToken,
  CustomerController.getBalance
);

router.post(
  "/complaints",
  AuthMiddleware.verifyToken,
  upload.single("image"), // Sử dụng middleware upload để xử lý file
  CustomerController.createComplaint
);

router.post("/manage-infor", authMiddleware.verifyToken, upload.single("image"), CustomerController.updateInformation);

//rating
// router.get("/rating-by-id/:id",CustomerController.getRatingById);
router.post("/rating", authMiddleware.verifyToken, CustomerController.addRating);
router.put("/edit-rating", authMiddleware.verifyToken, CustomerController.editRating);
router.delete("/delete-rating/:id", authMiddleware.verifyToken, CustomerController.deleteRating);

router.post('/repairmen/nearby', authMiddleware.verifyToken, CustomerController.findNearbyRepairmen);
//user-information
router.get('/user-info', authMiddleware.verifyToken, CustomerController.getUserInfo);
router.get("/get-request",authMiddleware.verifyToken,CustomerController.getAllRequests);

//gửi yêu cầu tìm thợ
router.post('/send-request',authMiddleware.verifyToken, CustomerController.sendRequest);

router.get('/requests/:requestId/find-repairman/:radius', authMiddleware.verifyToken, CustomerController.findRepairman);

module.exports = router;