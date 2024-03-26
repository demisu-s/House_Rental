const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    registerHouse,
    getAllHouse,
    getAllHouses,
    updateHouseById,
    deleteHouseById,
    searchHouses,
    getHouseById,
    markHouseUnavailable} = require("../controllers/houseController");

const { adminAuthorization } = require("../middleware/adminAuthorization");
const { landlordAuthorization } = require("../middleware/landlordAuthorization");
const {brokerAuthorization}=require("../middleware/brokerAuthorization")
const {tenantAuthorization}=require('../middleware/tenantAuthorization')
const {superAdminAuthorization}=require('../middleware/superAdminAuthorization')

// Routes for houses
router.post("/", protect, (landlordAuthorization,brokerAuthorization), registerHouse);

router.get("/",protect,getAllHouses);//current log in user 
router.get("/:id",protect, getAllHouse); // Get a specific house by ID only broker or landlord can see
router.put("/:id", protect, (landlordAuthorization,brokerAuthorization), updateHouseById);
router.delete("/:id", protect, brokerAuthorization, deleteHouseById);
router.get("searchHouse",protect,tenantAuthorization,searchHouses)
router.get("getDetailById",protect,tenantAuthorization,getHouseById)
//available status  
router.put("/houses/:id/unavailable",protect,[landlordAuthorization,brokerAuthorization],markHouseUnavailable)
module.exports = router;  