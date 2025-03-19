const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const PaymentController = require("../controllers/PaymentController");

//create a payment
router.post("/payment", AuthMiddleware.verifyToken, PaymentController.payment);
router.post("/callback", PaymentController.callback);


module.exports = router;