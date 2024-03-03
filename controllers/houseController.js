const House = require("../models/houseModel");
const asyncHandler = require("express-async-handler");

// register a new house
const registerHouse = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    const newHouse = await House.create({
      title,
      description,
      price,
      location,
      landlord: req.user._id,
    });

    res.status(201).json(newHouse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not register house", message: error.message });
  }
};

// get all houses
const getHouses = asyncHandler(async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve houses", message: error.message });
  }
});

// get a specific house by ID
const getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json(house);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve house", message: error.message });
  }
};

// Update a house by ID
const updateHouse = async (req, res) => {
  try {
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedHouse) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json(updatedHouse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update house", message: error.message });
  }
};

// Delete a house by ID
const deleteHouse = async (req, res) => {
  try {
    const deletedHouse = await House.findByIdAndDelete(req.params.id);
    if (!deletedHouse) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json({ message: "House deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete house", message: error.message });
  }
};

module.exports = {
  registerHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
};
