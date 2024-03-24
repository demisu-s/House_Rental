const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  landlordAuthorization,
} = require("../middleware/landlordAuthorization");
const { brokerAuthorization } = require("../middleware/brokerAuthorization");
const { tenantAuthorization } = require("../middleware/tenantAuthorization");

const {
  landlordOrBrokerOrTenantMiddleware,
} = require("../middleware/landlordOrBrokerOrTenantMiddleware");
const {
  landlordAndBrokerMiddleware,
} = require("../middleware/landlordAndBrokerMiddleware");

const {
  createReport,
  getReports,
  getReportByID,
  updateReport,
  deleteReport,
  getNotifications,
  getReportsBySubmitterId,
} = require("../controllers/reportController");

// Routes for reports
router.post("/", protect, landlordOrBrokerOrTenantMiddleware, createReport);
router.get("/:id", protect, landlordAndBrokerMiddleware, getReportByID);
router.put("/:id", protect, landlordAndBrokerMiddleware, updateReport); // update report status
router.delete("/:id", protect, landlordAndBrokerMiddleware, deleteReport);
router.get(
  "/notifications/:id",
  protect,
  landlordOrBrokerOrTenantMiddleware,
  getNotifications
);
router.get(
  "/submitter/:id",
  protect,
  landlordAndBrokerMiddleware,
  getReportsBySubmitterId
);

module.exports = router;
