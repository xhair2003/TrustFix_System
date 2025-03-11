const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const CustomerController = require("../controllers/CustomerController");
const upload = require("../middlewares/upload_IMG");


router.get(
  "/depositeHistory",
  AuthMiddleware.verifyToken,
  CustomerController.getAllDepositeHistory
);

router.post(
  "/complaints",
  AuthMiddleware.verifyToken,
  CustomerController.createComplaint
);

module.exports = router;
