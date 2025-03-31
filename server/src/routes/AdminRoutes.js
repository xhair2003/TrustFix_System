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
router.post("/complaints/:complaintId/replies", AuthMiddleware.verifyAdmin, AdminController.replyToComplaint);

// API transaction
router.get("/view-history-payment", AuthMiddleware.verifyAdmin, AdminController.viewHistoryPayment);
router.get("/view-all-transactions", AuthMiddleware.verifyAdmin, AdminController.viewAllTransactions);
router.get("/view-deposite-history", AuthMiddleware.verifyAdmin, AdminController.viewDepositeHistory);


// User routes for Admin
router.get("/view-all-users", AuthMiddleware.verifyAdmin, AdminController.getAllUsers);
router.delete("/delete-user/:userId", AuthMiddleware.verifyAdmin, AdminController.deleteUserById);
router.put("/lock-user/:userId", AuthMiddleware.verifyAdmin, AdminController.lockUserByUserId);
router.put("/unlock-user/:userId", AuthMiddleware.verifyAdmin, AdminController.unlockUserByUserId);

// repair booking
router.get("/list-repair-booking-history", AuthMiddleware.verifyAdmin, AdminController.viewRepairBookingHistory);


//Service Price routes (VIPS)
router.post("/service/add-price", AuthMiddleware.verifyAdmin, AdminController.addServicePrice);
router.put("/service/update", AuthMiddleware.verifyAdmin, AdminController.updateServicePrice);
router.delete("/service/delete-price/:serviceId", AuthMiddleware.verifyAdmin, AdminController.deleteServicePrice);
router.get("/service/all-price", AuthMiddleware.verifyAdmin, AdminController.getAllServicePrice)

// Admin routes - require admin authentication
router.get("/repairman-upgrade-requests/pending", AuthMiddleware.verifyAdmin, AdminController.getPendingUpgradeRequests);
router.put("/repairman-upgrade-requests/:requestId/verify", AuthMiddleware.verifyAdmin, AdminController.verifyRepairmanUpgradeRequest);


// Dashboard

// User
router.get("/total-users", AuthMiddleware.verifyAdmin, AdminController.totalUsers);
router.get("/total-banned-users", AuthMiddleware.verifyAdmin, AdminController.totalBannedUsers);
router.get("/total-repairmen", AuthMiddleware.verifyAdmin, AdminController.totalRepairmen);
router.get("/total-customers", AuthMiddleware.verifyAdmin, AdminController.totalCustomers);

// Repair booking 
// API tính tổng số đơn hàng "Completed"
router.get("/total-completed-requests", AuthMiddleware.verifyAdmin, AdminController.getCompletedRequestsCount);

// API tính tổng số đơn hàng "Confirmed"
router.get("/total-confirmed-requests", AuthMiddleware.verifyAdmin, AdminController.getConfirmedRequestsCount);

// API tính tổng số đơn hàng "Pending"
router.get("/total-pending-requests", AuthMiddleware.verifyAdmin, AdminController.getPendingRequestsCount);

// API tính tổng số đơn hàng "Cancelled"
router.get("/total-cancelled-requests", AuthMiddleware.verifyAdmin, AdminController.getCancelledRequestsCount);

// API tính tổng số đơn hàng "Make payment"
router.get("/total-make-payment-requests", AuthMiddleware.verifyAdmin, AdminController.getMakePaymentRequestsCount);

// API tính tổng số đơn hàng "Deal price"
router.get("/total-deal-price-requests", AuthMiddleware.verifyAdmin, AdminController.getDealPriceRequestsCount);

// pending complaints
router.get("/total-pending-complaints", AuthMiddleware.verifyAdmin, AdminController.getPendingComplaintsCount);

// pending upgrade requests
router.get("/total-pending-upgrade-requests", AuthMiddleware.verifyAdmin, AdminController.getPendingUpgradeRequestsCount);

// total categories
router.get("/total-service-industries", AuthMiddleware.verifyAdmin, AdminController.totalServiceIndustries);

// total subcategories by each category
router.get("/total-services-by-industry", AuthMiddleware.verifyAdmin, AdminController.totalServicesByIndustry);

// total service prices
router.get("/total-service-prices", AuthMiddleware.verifyAdmin, AdminController.totalServicePrices);

//get Pending Requests
router.get("/pending-2nd-certification", AuthMiddleware.verifyAdmin, AdminController.viewPendingSupplementaryCertificates);
//verify 2nd certification (Accept/Reject)
router.post("/verify-2nd-certification", AuthMiddleware.verifyAdmin, AdminController.verifyPracticeCertificate);


// get repairman monthly payment
router.get("/view-detail-monthly-payment/:id", AuthMiddleware.verifyAdmin, AdminController.getRepairmanMonthlyPaymentById);


router.get("/view-all-monthly-payment", AuthMiddleware.verifyAdmin, AdminController.getAllRepairmanMonthlyPayments);

router.get("/view-vip-services/most-used", AuthMiddleware.verifyAdmin, AdminController.getMostUsedVipService);

module.exports = router;    
