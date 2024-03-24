const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {landlordAuthorization}=require("../middleware/landlordAuthorization")
const {brokerAuthorization}=require("../middleware/brokerAuthorization")
const {tenantAuthorization}=require("../middleware/tenantAuthorization")
const {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

// Routes for reports
router.post("/",protect, [brokerAuthorization,landlordAuthorization, tenantAuthorization], createReport);
router.get("/:id",protect, [brokerAuthorization,landlordAuthorization],getReports);
router.put("/:id",protect, [brokerAuthorization,landlordAuthorization],updateReport); 
router.delete("/:id",protect,[brokerAuthorization,landlordAuthorization],deleteReport);

module.exports = router;