const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
} = require("../controllers/houseController");

const { adminValidator } = require("../middleware/adminValidator");
const { landlordValidator } = require("../middleware/landlordValidator");

// Routes for houses
router.post("/", protect, landlordValidator, registerHouse);
router.get("/", getHouses);
router.get("/:id", getHouseById); // Get a specific house by ID
router.put("/:id", protect, landlordValidator, updateHouse);
router.delete("/:id", protect, landlordValidator, deleteHouse);

module.exports = router;
