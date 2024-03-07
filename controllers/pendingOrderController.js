const asyncHandler = require("express-async-handler");
const PendingOrder = require("../models/pendingOrderModel");
const asyncHandler = require("express-async-handler");

const createPendingOrder = asyncHandler(async (req, res) => {
  const { tenantID, date, bidPrice, houseEntityID } = req.body;

  const newPendingOrder = await PendingOrder.create({
    tenantID,
    date,
    bidPrice,
    houseEntityID,
  });

  res.status(201).json(newPendingOrder);
});

const getAllPendingOrders = asyncHandler(async (req, res) => {
  const pendingOrders = await PendingOrder.find();
  res.json(pendingOrders);
});

const getPendingOrderById = asyncHandler(async (req, res) => {
  const pendingOrder = await PendingOrder.findById(req.params.id);
  if (!pendingOrder) {
    return res.status(404).json({ error: "Pending order not found" });
  }
  res.json(pendingOrder);
});

const updatePendingOrder = asyncHandler(async (req, res) => {
  const updatedPendingOrder = await PendingOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPendingOrder) {
    return res.status(404).json({ error: "Pending order not found" });
  }

  res.json(updatedPendingOrder);
});

const deletePendingOrder = asyncHandler(async (req, res) => {
  const deletedPendingOrder = await PendingOrder.findByIdAndDelete(
    req.params.id
  );

  if (!deletedPendingOrder) {
    return res.status(404).json({ error: "Pending order not found" });
  }

  res.json({ message: "Pending order deleted" });
});

module.exports = {
  createPendingOrder,
  getAllPendingOrders,
  getPendingOrderById,
  updatePendingOrder,
  deletePendingOrder,
};
