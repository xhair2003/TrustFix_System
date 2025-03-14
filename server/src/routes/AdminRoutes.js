const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const AdminController = require("../controllers/AdminController");


// --- Admin routes 
// Service Industry routes
router.post("/service-industries", AuthMiddleware.verifyAdmin, AdminController.createServiceIndustry);
router.get("/service-industries", AdminController.getAllServiceIndustries);
router.get("/service-industries/:id", AdminController.getServiceIndustryById);
router.put("/service-industries/:id", AuthMiddleware.verifyAdmin, AdminController.updateServiceIndustry);
router.delete("/service-industries/:id", AuthMiddleware.verifyAdmin, AdminController.deleteServiceIndustry);

// Service routes
router.post("/services/:id", AuthMiddleware.verifyAdmin, AdminController.createService);
router.get("/services", AdminController.getAllServices);
router.get("/services/:id", AdminController.getServiceById);
router.put("/services/:id", AuthMiddleware.verifyAdmin, AdminController.updateService);
router.delete("/services/:id", AuthMiddleware.verifyAdmin, AdminController.deleteService);

// Complaint routes for Admin
router.get("/complaints", AuthMiddleware.verifyAdmin, AdminController.getAllComplaints);
router.get("/complaints/:id", AuthMiddleware.verifyAdmin, AdminController.getComplaintById);
router.post("/complaints/:id/replies", AuthMiddleware.verifyAdmin, AdminController.replyToComplaint);

// API transaction
router.get("/view-history-payment", AuthMiddleware.verifyAdmin, AdminController.viewHistoryPayment);
router.get("/view-all-transactions", AuthMiddleware.verifyAdmin, AdminController.viewAllTransactions);
router.get("/view-deposite-history", AuthMiddleware.verifyAdmin, AdminController.viewDepositeHistory);


// User routes for Admin
router.get("/users", AuthMiddleware.verifyAdmin, AdminController.getAllUsers);
router.delete("/users/:userId", AuthMiddleware.verifyAdmin, AdminController.deleteUserById);
router.put("/users/lock/:userId", AuthMiddleware.verifyAdmin, AdminController.lockUserByUserId);
router.put("/users/unlock/:userId", AuthMiddleware.verifyAdmin, AdminController.unlockUserByUserId);
router.get("/list-repair-booking-history", AuthMiddleware.verifyAdmin, AdminController.viewRepairBookingHistory);

//Service Price routes
router.post("/service/add-price", AuthMiddleware.verifyAdmin, AdminController.addServicePrice);
router.put("/service/update", AuthMiddleware.verifyAdmin, AdminController.updateServicePrice);
router.delete("/service/delete-price/:id", AuthMiddleware.verifyAdmin, AdminController.deleteServicePrice);
router.get("/service/all-price", AuthMiddleware.verifyAdmin, AdminController.getAllServicePrice)

module.exports = router;    