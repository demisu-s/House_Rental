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

// Register a new house with multiple images
const registerHouse = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const { title, description, address, square_feet, bedrooms, bathrooms, price, property_type, landlord, broker } = req.body;
    const houseImagePaths = req.files.map(file => file.path);
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
        landlord:req.user._id,
        broker:req.user._id, 
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

// Get all houses created by the currently logged-in user if they are landlord or broker
const getAllHouse = asyncHandler(async (req, res) => {
    const house = await House.find({ user: req.user.id });
     // Verify if the current user is the landlord or the broker of the house
     const isLandlord = house.landlord.toString() === req.user.id;
  const isBroker = house.broker.toString() === req.user.id;
 
     if (!isLandlord && !isBroker) {
       return res.status(401).json({ error: "User not authorized" });
     }
    res.status(200).json(house);
  });

// Update House by ID
const updateHouseById = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);
  if (!house) {
    return res.status(404).json({ error: "House not found" });
  }

  const isLandlord = house.landlord.toString() === req.user.id;
  const isBroker = house.broker.toString() === req.user.id;

  if (!isLandlord && !isBroker) {
    return res.status(401).json({ error: "User not authorized" });
  }

  const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedHouse);
});

// Delete House by ID
const deleteHouseById = asyncHandler(async (req, res) => {
  const house = await House.findById(req.params.id);
  if (!house) {
    return res.status(404).json({ error: "House not found" });
  }

  const isLandlord = house.landlord.toString() === req.user.id;
  const isBroker = house.broker.toString() === req.user.id;

  if (!isLandlord && !isBroker) {
    return res.status(401).json({ error: "User not authorized" });
  }

  await House.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "House deleted successfully" });
});

module.exports = {
  registerHouse,
  getAllHouses,
  getAllHouse,
  updateHouseById,
  deleteHouseById,
};
