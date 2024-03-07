const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPendingOrder,
  getAllPendingOrders,
  getPendingOrderById,
  updatePendingOrder,
  deletePendingOrder,
} = require("../controllers/pendingOrderController");

// Routes for pending orders
router.post("/", protect, createPendingOrder);
router.get("/", protect, getAllPendingOrders);
router.get("/:id", protect, getPendingOrderById);
router.patch("/:id", protect, updatePendingOrder);
router.delete("/:id", protect, deletePendingOrder);

module.exports = router;
