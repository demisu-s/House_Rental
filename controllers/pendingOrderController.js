
const asyncHandler = require("express-async-handler");
const PendingOrder = require("../models/pendingOrderModel");
const asyncHandler = require("express-async-handler");

const createNotification = async (recipientId, message, details, status) => {
  try {
    // Create a new notification in the database
    const notification = await Notification.create({
      recipient: recipientId,
      message,
      details,
      status: status || "unread", // Default status to 'unread' if not provided
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
};

const createPendingOrder = asyncHandler(async (req, res) => {
  const { tenantID, date, bidPrice, houseEntityID } = req.body;

  // Check if house exists
  const houseEntity = await House.findById(houseEntityID);
  if (!houseEntity) {
    return res.status(404).json({ error: "House not found" });
  }
  // Check if house is available
  if (houseEntity.status !== "available") {
    return res.status(400).json({ error: "House not available for rental" });
  }

  const newPendingOrder = await PendingOrder.create({
    tenantID,
    date,
    bidPrice,
    houseEntityID,
  });

  // populate
  await newPendingOrder
    .populate("tenantID")
    .populate({
      path: "houseEntityID",
      populate: [{ path: "landlord" }, { path: "broker" }],
    })
    .execPopulate();

  // Send notification to the landlord or broker
  const recipientId = houseEntity.landlord || houseEntity.broker; // ID for landlord or broker
  const message = "New pending order created";
  const details = {
    bidPrice,
    tenant: [
      newPendingOrder.tenantID.firstName,
      newPendingOrder.tenantID.lastName,
    ],
    tenantEmail: newPendingOrder.tenantID.email,
    tenantPhoneNumber: newPendingOrder.tenantID.phoneNumber,
    tenantAddress: newPendingOrder.tenantID.address,
  };
  await createNotification(recipientId, message, details, "unread");
  res.status(201).json(newPendingOrder);
});

// get pending order
const getPendingOrders = asyncHandler(async (req, res) => {
  try {
    // Get the id and role of the current user
    const { id, role } = req.user;

    // Houses registered by broker or landlord
    let housesOwned;
    if (role === "landlord") {
      housesOwned = await House.find({ landlord: id });
    } else if (role === "broker") {
      housesOwned = await House.find({ broker: id });
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Extract house IDs of landlord or broker
    const houseIDs = housesOwned.map((house) => house._id);

    // Find pending orders for houses owned by landlord or broker
    const pendingOrders = await PendingOrder.find({
      houseEntityID: { $in: houseIDs },
      status: "Pending",
    })
      .populate({
        path: "tenantID",
      })
      .populate("houseEntityID");

    // Format pending orders with required information
    const formattedPendingOrders = pendingOrders.map((order) => ({
      tenant: {
        firstName: order.tenantID.firstName,
        lastName: order.tenantID.lastName,
        email: order.tenantID.email,
        phoneNumber: order.tenantID.phoneNumber,
        address: order.tenantID.address,
      },
      bidPrice: order.bidPrice,
      dateSubmitted: order.date,
      house: {
        location: order.houseEntityID.location,
      },
    }));
    res.json(formattedPendingOrders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const acceptPendingOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  // search for order from database
  const order = await PendingOrder.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Check if house is available
  const houseEntity = await House.findById(order.houseEntityID);
  if (!houseEntity || houseEntity.status !== "available") {
    return res.status(400).json({ error: "House not available" });
  }

  // set the pending order status to approved
  order.status = "Approved";
  await order.save();

  // Update the status of the house to rented
  if (houseEntity) {
    houseEntity.status = "rented";
    await houseEntity.save();
  }

  // Send notification to the tenant
  const notificationMessage = "Your rental application has been accepted.";
  const notificationDetails = {
    orderStatus: "Approved",
    orderId: order._id,
  };

  await createNotification(
    order.tenantID,
    notificationMessage,
    notificationDetails,
    "unread"
  );

  // Cancel conflicting pending orders
  await cancelConflictingPendingOrders(order, order.houseEntityID, order.date);

  res.json({ message: "Order accepted successfully" });
});

const cancelConflictingPendingOrders = async (order, houseEntityID, date) => {
  // Find conflicting orders
  const conflictingOrders = await PendingOrder.find({
    houseEntityID,
    date,
    status: "Pending", // consider only pending orders
    _id: { $ne: acceptedOrder._id }, // Exclude the accepted order
  });

  // set order to cancelled
  for (const conflictingOrder of conflictingOrders) {
    conflictingOrder.status = "Cancelled";
    await conflictingOrder.save();
    // notify tenant about cancellation
  }
};

const rejectPendingOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await PendingOrder.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // set the pending order status to approved
  order.status = "Rejected";
  await order.save();

  // Send notification to the tenant
  const notificationMessage = "Your rental application has been rejected.";
  const notificationDetails = {
    orderStatus: "Rejected",
    orderId: order._id,
  };

  await createNotification(
    order.tenantID,
    notificationMessage,
    notificationDetails,
    "unread"
  );

  res.json({ message: "Order rejected successfully" });
});

const proposeCounterOffer = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const newBidPrice = req.body.newBidPrice;
  const order = await PendingOrder.findById(orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Create a new pending order with the proposed changes
  const newOrder = new PendingOrder({
    tenantID: order.tenantID,
    date: order.date,
    bidPrice: newBidPrice, // new bid price offered by the landlord/broker
    houseEntityID: order.houseEntityID,
    status: "Proposed",
  });

  await newOrder.save();

  // Update the status of the original pending order
  order.status = "Proposed";
  await order.save();

  // Send notification to the tenant
  const notificationMessage = `A counteroffer of ${newBidPrice} has been proposed for your rental application.`;
  const notificationDetails = {
    bidPrice: newBidPrice,
    dateSubmitted: newOrder.date,
    houseEntity: newOrder.houseEntityID,
  };

  await createNotification(
    order.tenantID,
    notificationMessage,
    notificationDetails,
    "unread"
  );

  res.json({ message: "Counter offer proposed successfully" });
});

module.exports = {
  createPendingOrder,
  getPendingOrders,
  acceptPendingOrder,
  rejectPendingOrder,
  proposeCounterOffer,
};