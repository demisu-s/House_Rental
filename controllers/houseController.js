const House = require("../models/houseModel");
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
}).array("houseImages", 10); // Up to 10 images

//creating house only landlord and broker can create house
const registerHouse = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    const { title, description, address, square_feet, bedrooms, bathrooms, price, property_type } = req.body;
    const houseImagePaths = req.files.map(file => file.path);
    let landlordId, brokerId;

    // Determine whether the user is a landlord or a broker
    if (req.user.role === 'Landlord') {
      landlordId = req.user._id;
    } else if (req.user.role === 'Broker') {
      brokerId = req.user._id;
    }

    // console.log("landlordId:", landlordId);
    // console.log("brokerId:", brokerId);

    try {
      const newHouse = await House.create({
        title,
        description,
        address,
        square_feet,
        bedrooms,
        bathrooms,
        price,
        property_type,
        houseImagePaths,
        landlordId: landlordId || undefined, // Set to undefined if not defined
        brokerId: brokerId || undefined,     // Set to undefined if not defined
      });
      res.status(201).json(newHouse);
    } catch (error) {
      res.status(500).json({ error: "Could not register house", message: error.message });
    }
  });
});



// Get all houses
const getAllHouses = asyncHandler(async (req, res) => {
  const houses = await House.find({});
  res.status(200).json(houses);
});

const getAllHouse = asyncHandler(async (req, res) => {
  // Find all houses where the logged-in user is either the landlord or the broker
  const houses = await House.find({ $or: [{ landlord: req.user.id }, { broker: req.user.id }] });

  // Check if any houses were found
  if (!houses || houses.length === 0) {
      return res.status(404).json({ error: "No houses found for the current user" });
  }

  res.status(200).json(houses);
});




// Search houses based on criteria
const searchHouses = asyncHandler(async (req, res) => {
  const { address, property_type, min_price, max_price } = req.query;

  let filter = {};

  // Build the filter object based on provided query parameters
  if (address) {
    filter.address = { $regex: address, $options: 'i' }; // Case-insensitive search
  }
  if (property_type) {
    filter.property_type = property_type;
  }
  if (min_price && max_price) {
    filter.price = { $gte: min_price, $lte: max_price };
  } else if (min_price) {
    filter.price = { $gte: min_price };
  } else if (max_price) {
    filter.price = { $lte: max_price };
  }

  try {
    const houses = await House.find(filter);
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get detailed information about a specific house by ID
const getHouseById = asyncHandler(async (req, res) => {
  const houseId = req.params.id;

  try {
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});






// Update House by ID
const updateHouseById = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);
  if (!house) {
    return res.status(404).json({ error: "House not found" });
  }

  // const isLandlord = house.landlord.toString() === req.user.id;
  // const isBroker = house.broker.toString() === req.user.id;

  // if (!isLandlord && !isBroker) {
  //   return res.status(401).json({ error: "User not authorized" });
  // }

  const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedHouse);
});

const deleteHouseById = asyncHandler(async (req, res) => {
  const houseId = req.params.id;

  try {
    // Find the house by ID
    const house = await House.findById(houseId);

    // Check if the house exists
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Check if the user is authorized to delete the house
    if (house.landlord.toString() !== req.user.id && house.broker.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized to delete this house" });
    }

    // Update the house's 'deleted' flag to mark it as deactivated
    house.deleted = true;
    await house.save();

    res.status(200).json({ message: "House deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 


  // Function to mark a house as unavailable for specific periods
const markHouseUnavailable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fromDate, toDate, reason } = req.body;

  try {
      const house = await House.findById(id);

      if (!house) {
          return res.status(404).json({ error: "House not found" });
      }

      // Update availability status and add unavailable period details
      house.availability.status = "unavailable";
      house.availability.unavailablePeriods.push({ fromDate, toDate, reason });

      await house.save();

      res.status(200).json({ message: "House marked as unavailable" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = {
  registerHouse,
  getAllHouses,
  getAllHouse,
  updateHouseById,
  deleteHouseById,
  searchHouses,
  getHouseById,
  markHouseUnavailable
};
