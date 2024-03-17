const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {registerHouse,
    getAllHouse,
    getAllHouses,
    updateHouseById,
    deleteHouseById,} = require("../controllers/houseController");

const { adminAuthorization } = require("../middleware/adminAuthorization");
const { landlordAuthorization } = require("../middleware/landlordAuthorization");
const {brokerAuthorization}=require("../middleware/brokerAuthorization")

// Routes for houses
router.post("/", protect, [landlordAuthorization,brokerAuthorization], registerHouse);
router.get("/",getAllHouses);
router.get("/yourHouse",protect, getAllHouse); // Get a specific house by ID only broker or landlord can see
router.put("/:id", protect, [landlordAuthorization,brokerAuthorization], updateHouseById);
router.delete("/:id", protect, [landlordAuthorization,brokerAuthorization], deleteHouseById);

module.exports = router;