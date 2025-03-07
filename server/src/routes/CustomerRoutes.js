const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const CustomerController = require("../controllers/CustomerController");
const upload = require("../middlewares/upload_IMG");


router.get("/transactionHistory", AuthMiddleware.verifyToken, CustomerController.getAllDepositeHistory);
router.post("/complaints", AuthMiddleware.verifyToken, CustomerController.createComplaint);
router.get("/requests-history/:userId",CustomerController.getRequestsByUserId)
router.get("/get-all-requests",CustomerController.getAllRequests)
router.post("/rating",AuthMiddleware.verifyToken,CustomerController.addRating)
router.put("/edit-rating",AuthMiddleware.verifyToken,CustomerController.editRating)
router.delete("/delete-rating/:rating_id",AuthMiddleware.verifyToken,CustomerController.deleteRating)
router.post("/manage-infor",AuthMiddleware.verifyToken,upload.single("image"),CustomerController.updateInformation)
module.exports = router;