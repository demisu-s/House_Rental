/*
const asyncHandler = require('express-async-handler');
const House = require('../models/houseModel');
const RentalRequest = require('../models/rentalRequestModel');
const { isBroker } = require('../middlewares/authMiddleware');

// List rentals on behalf of landlords
const listRentalsOnBehalf = asyncHandler(async (req, res) => {
  const houses = await House.find({ landlord: req.user._id });
  res.status(200).json(houses);
});

// List pending rental requests
const getPendingRentalRequests = asyncHandler(async (req, res) => {
  const rentalRequests = await RentalRequest.find({
    house: { $in: req.user.managedHouses },
    status: 'pending'
  });
  res.status(200).json(rentalRequests);
});

// Approve a rental request
const approveRentalRequest = asyncHandler(async (req, res) => {
  const rentalRequest = await RentalRequest.findById(req.params.id);
  if (!rentalRequest) {
    res.status(404);
    throw new Error('Rental request not found');
  }

  const house = await House.findById(rentalRequest.house);
  house.rented = true;
  house.tenant = rentalRequest.renter;
  await house.save();

  rentalRequest.status = 'approved';
  rentalRequest.startDate = req.body.startDate;
  rentalRequest.endDate = req.body.endDate;
  await rentalRequest.save();

  res.status(200).json(rentalRequest);
});

// Reject a rental request
const rejectRentalRequest = asyncHandler(async (req, res) => {
  const rentalRequest = await RentalRequest.findById(req.params.id);
  if (!rentalRequest) {
    res.status(404);
    throw new Error('Rental request not found');
  }

  rentalRequest.status = 'rejected';
  awaitrentalRequest.save();

  res.status(200).json(rentalRequest);
});

module.exports = {
  listRentalsOnBehalf,
  getPendingRentalRequests,
  approveRentalRequest,
  rejectRentalRequest
};
*/