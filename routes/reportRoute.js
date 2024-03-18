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
router.post("/", [landlordAuthorization, brokerAuthorization, tenantAuthorization], protect, createReport);
router.get("/:id", [landlordAuthorization, brokerAuthorization], protect, getReports);
router.put("/:id", [landlordAuthorization, brokerAuthorization], protect, updateReport); 
router.delete("/:id",[landlordAuthorization, brokerAuthorization], protect, deleteReport);

module.exports = router;