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

router.post(
  "/complaints",
  AuthMiddleware.verifyToken,
  CustomerController.createComplaint
);

router.post("/manage-infor",authMiddleware.verifyToken,upload.single("image"),CustomerController.updateInformation);

//rating
// router.get("/rating-by-id/:id",CustomerController.getRatingById);
router.post("/rating",authMiddleware.verifyToken,CustomerController.addRating);
router.put("/edit-rating",authMiddleware.verifyToken,CustomerController.editRating);
router.delete("/delete-rating/:id",authMiddleware.verifyToken,CustomerController.deleteRating);
//history repair

router.get("/get-request",authMiddleware.verifyToken,CustomerController.getAllRequests);
module.exports = router;
