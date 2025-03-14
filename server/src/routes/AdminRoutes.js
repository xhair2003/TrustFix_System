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
router.get("/transactions/history", AuthMiddleware.verifyAdmin, AdminController.viewHistoryPayment);


//Vip routes
router.post("/add-vip", AuthMiddleware.verifyAdmin, AdminController.addVipService);
router.put("/edit-vip", AuthMiddleware.verifyAdmin, AdminController.updateVipService);
router.delete("/delete-vip/:id", AuthMiddleware.verifyAdmin, AdminController.deleteVipService);
router.get("/get-vip", AuthMiddleware.verifyToken, AdminController.getAllVipServices);


// Repairman Upgrade Request routes
router.post("/accept-update",AuthMiddleware.verifyAdmin,AdminController.acceptUpdate);
module.exports = router;    