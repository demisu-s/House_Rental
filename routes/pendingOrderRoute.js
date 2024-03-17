const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { tenantValidator } = require("../middleware/tenantValidator");
const { landlordValidator } = require("../middleware/landlordValidator");
const { brokerValidator } = require("../middleware/brokerValidator");
const {
  createPendingOrder,
  getPendingOrders,
  acceptPendingOrder,
  rejectPendingOrder,
  proposeCounterOffer,
} = require("../controllers/pendingOrderController");

// Routes for pending orders
router.post("/", tenantValidator, protect, createPendingOrder);

router.get(
  "/:id",
  [landlordValidator, brokerValidator],
  protect,
  getPendingOrders
);
router.post(
  "/accept/:id",
  [landlordValidator, brokerValidator],
  protect,
  acceptPendingOrder
);
router.post(
  "/reject/:id",
  [landlordValidator, brokerValidator],
  protect,
  rejectPendingOrder
);
router.post(
  "/propose/:id",
  [landlordValidator, brokerValidator],
  protect,
  proposeCounterOffer
);

module.exports = router;
