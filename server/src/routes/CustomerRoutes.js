const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const CustomerController = require("../controllers/CustomerController");

router.get("/transactionHistory", AuthMiddleware.verifyToken, CustomerController.getAllDepositeHistory);
router.post("/complaints", AuthMiddleware.verifyToken, CustomerController.createComplaint);

module.exports = router;