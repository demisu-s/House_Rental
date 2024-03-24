const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { tenantAuthorization } = require("../middleware/tenantAuthorization");
const {
  landlordAuthorization,
} = require("../middleware/landlordAuthorization");
const { brokerAuthorization } = require("../middleware/brokerAuthorization");

const {
  createPendingOrder,
  getPendingOrders,
  acceptPendingOrder,
  rejectPendingOrder,
  proposeCounterOffer,
  getNotifications,
} = require("../controllers/pendingOrderController");
const {
  landlordAndBrokerMiddleware,
} = require("../middleware/landlordAndBrokerMiddleware");
const { deletePendingOrder } = require("../controllers/pendingOrderController");
const {
  landlordOrBrokerOrTenantMiddleware,
} = require("../middleware/landlordOrBrokerOrTenantMiddleware");

// Routes for pending orders
router.post("/", protect, tenantAuthorization, createPendingOrder);

router.get("/", protect, landlordAndBrokerMiddleware, getPendingOrders);
router.delete("/:id", protect, landlordAndBrokerMiddleware, deletePendingOrder);
router.post(
  "/accept/:id",
  protect,
  landlordAndBrokerMiddleware,
  acceptPendingOrder
);
router.post(
  "/reject/:id",
  protect,
  landlordAndBrokerMiddleware,
  rejectPendingOrder
);
router.post(
  "/propose/:id",
  protect,
  landlordAndBrokerMiddleware,
  proposeCounterOffer
);
router.get(
  "/notifications",
  protect,
  landlordOrBrokerOrTenantMiddleware,
  getNotifications
);
module.exports = router;
