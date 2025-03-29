const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const CustomerController = require("../controllers/CustomerController");
const upload = require("../middlewares/upload_IMG");
const authMiddleware = require("../middlewares/authMiddleware");
const CustomerMiddleware = require("../middlewares/CustomerMiddleware");

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

router.get("/get-request", authMiddleware.verifyToken, CustomerController.getAllRequests);

//gửi yêu cầu tìm thợ
router.post('/send-request', authMiddleware.verifyToken, CustomerController.sendRequest);

router.post('/requests/find-repairman', authMiddleware.verifyToken, upload.array('image'), CustomerController.sendRequest, CustomerController.findRepairman);

//view-repair-history
router.get('/view-repair-history', authMiddleware.verifyToken, CustomerController.viewRepairHistory);
router.get("/get-request", authMiddleware.verifyToken, CustomerController.getAllRequests)

router.get('/viewRepairmanDeal/:requestId', authMiddleware.verifyToken, CustomerController.viewRepairmanDeal);
router.post('/assignedRepairman/:requestId/:repairmanId', authMiddleware.verifyToken, CustomerMiddleware.viewRepairmanDeal, CustomerController.assignedRepairman);

router.get('/viewRepairmanCompleted/:requestId', authMiddleware.verifyToken, CustomerController.getRequestCompleted);

router.get('/confirmRequest', authMiddleware.verifyToken, CustomerController.confirmRequest);
module.exports = router;

