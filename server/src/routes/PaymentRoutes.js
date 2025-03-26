const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const PaymentController = require("../controllers/PaymentController");

//create a payment
router.post("/payment", AuthMiddleware.verifyToken, PaymentController.payment);
router.post("/callback", PaymentController.callbackPayOS);
//Momo
router.post("/paymentMOMO", AuthMiddleware.verifyToken, PaymentController.paymentMOMO);
router.post("/callbackMOMO", PaymentController.callbackMOMO);



module.exports = router;