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


//user-information
router.get('/user-info', authMiddleware.verifyToken, CustomerController.getUserInfo);

//view-repair-history
router.get('/view-repair-history', authMiddleware.verifyToken, CustomerController.viewRepairHistory);

module.exports = router;