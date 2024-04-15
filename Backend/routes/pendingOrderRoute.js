const express = require("express");
const router = express.Router();  
const { protect } = require("../middleware/authMiddleware");
const { tenantAuthorization } = require("../middleware/tenantAuthorization");
const { landlordAuthorization } = require("../middleware/landlordAuthorization");
const { brokerAuthorization } = require("../middleware/brokerAuthorization");
const {
  createPendingOrder,
  getPendingOrders,
  acceptPendingOrder, 
  rejectPendingOrder,
  proposeCounterOffer,
} = require("../controllers/pendingOrderController");

// Routes for pending orders
router.post("/",protect, tenantAuthorization, createPendingOrder); 
router.get("/:id", protect,(landlordAuthorization, brokerAuthorization),getPendingOrders);
router.post("/accept/:id",protect,(landlordAuthorization, brokerAuthorization),acceptPendingOrder);
router.post( "/reject/:id",protect,(landlordAuthorization, brokerAuthorization), rejectPendingOrder);
router.post("/propose/:id", protect,(landlordAuthorization, brokerAuthorization),proposeCounterOffer);

module.exports = router;