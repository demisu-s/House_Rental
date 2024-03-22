/*
const House = require('../models/houseModel');
const User = require('../models/userModel');

exports.findHouses = async (req, res) => {
  try {
    const houses = await House.find({});
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookHouse = async (req, res) => {
  const { houseId, startDate, endDate } = req.body;
  try {
    const house = await House.findById(houseId);
    if (house.isAvailable(startDate, endDate)) {
      house.book(startDate, endDate, req.user);
      await house.save();
      res.status(200).json(house);
    } else {
      res.status(400).json({ message: 'House not available' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

*/