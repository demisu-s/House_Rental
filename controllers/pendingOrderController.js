<<<<<<< Updated upstream

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
=======
const asyncHandler = require("express-async-handler");
const PendingOrder = require("../models/pendingOrderModel");
const House = require("../models/houseModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

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

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userRole = req.user.role;
  console.log(userRole);

  let recipientQuery = {};

  // Define recipientQuery based on userRole
  if (userRole === "Landlord" || userRole === "Broker") {
    recipientQuery = {
      $or: [
        { "details.houseEntity.landlord": userId },
        { "details.houseEntity.broker": userId },
      ],
    };
  } else if (userRole === "Tenant") {
    recipientQuery = { recipient: userId };
    console.log(recipientQuery);
  }
  // Retrieve unread notifications for the user
  const notifications = await Notification.find({
    ...recipientQuery,
    status: "unread",
  });
  console.log(notifications);
  // Mark notifications as read
  await Notification.updateMany(
    { ...recipientQuery, status: "unread" },
    { status: "read" }
  );
  res.status(200).json(notifications);
});

const createPendingOrder = asyncHandler(async (req, res) => {
  const { tenantID, date, bidPrice, houseEntityID } = req.body;
  const userId = req.user._id;
  const role = req.user.role;

  // Check if the user is a tenant
  if (role !== "Tenant") {
    return res
      .status(403)
      .json({ error: "Only tenants can submit a pending order" });
  }

  console.log("houseEntityID:", houseEntityID); // Check the value of houseEntityID
  // Check if houseEntityID is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(houseEntityID)) {
    console.error("Invalid houseEntityID format:", houseEntityID);
    return res.status(400).json({ error: "Invalid houseEntityID format" });
  }

  // Convert houseEntityID to ObjectId
  let houseId;
  try {
    houseId = new mongoose.Types.ObjectId(houseEntityID);
    console.log("Converted houseId:", houseId); // Check the converted ObjectId
  } catch (error) {
    console.error("Error converting houseEntityID to ObjectId:", error);
    return res.status(400).json({ error: "Invalid houseEntityID format" });
  }

  // Check if house exists
  const houseEntity = await House.findById(houseEntityID);
  console.log(houseEntity);
  if (!houseEntity) {
    return res.status(404).json({ error: "House not found" });
  }
  // Check if house is available
  if (houseEntity.status !== "available") {
    return res.status(400).json({ error: "House not available for rental" });
  }

  // Populate tenantID with the tenant document
  const tenant = await User.findById(tenantID); // Assuming the tenant is stored in the User model
  if (!tenant) {
    return res.status(404).json({ error: "Tenant not found" });
  }

  const newPendingOrder = await PendingOrder.create({
    tenantID: tenant, // Assign the tenant document
    date,
    bidPrice,
    houseEntityID,
  });
  // Populate fields
  const populatedOrder = await PendingOrder.findById(newPendingOrder._id)
    .populate("tenantID")
    .populate({
      path: "houseEntityID",
      populate: [{ path: "landlord" }, { path: "broker" }],
    });

  // Check if newPendingOrder is a Mongoose document
  if (!newPendingOrder._id) {
    return res.status(500).json({ error: "Failed to create pending order" });
  }
  // Send notification to the landlord or broker
  const recipientId = houseEntity.landlord || houseEntity.broker; // ID for landlord or broker
  const message = "New pending order created";
  const details = {
    bidPrice,
    tenant: [tenant.firstName, tenant.lastName],
    tenantEmail: tenant.email,
    tenantPhoneNumber: tenant.phoneNumber,
    tenantAddress: tenant.address,
  };
  const notif = await createNotification(
    recipientId,
    message,
    details,
    "unread"
  );
  console.log(notif);
  res.status(201).json(newPendingOrder);
});

// get pending order
const getPendingOrders = asyncHandler(async (req, res) => {
  // const { userId, role } = req.user;
  const userId = req.user.id;
  const role = req.user.role;
  console.log(role);

  const houseEntity = await House.findById(order.houseEntityID);
  // Check if the user has permission to accept the pending order
  if (
    (role === "Landlord" &&
      houseEntity.landlord.toString() !== userId.toString()) ||
    (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
  ) {
    return res
      .status(403)
      .json({ error: "Unauthorized to accept this pending order" });
  }

  try {
    // Find houses registered by the landlord or broker
    let houses;
    if (role === "Landlord" || role === "Broker") {
      houses = await House.find({ [role.toLowerCase()]: userId }).select("_id");
    } else {
      return res
        .status(403)
        .json({ error: "Available for Landlord or Broker Only" });
    }

    // Extract house IDs from the houses array
    const houseIds = houses.map((house) => house._id);

    // Retrieve pending orders associated with the found house IDs
    const pendingOrders = await PendingOrder.find({
      houseEntityID: { $in: houseIds },
    })
      .populate("tenantID") // Assuming tenantID needs to be populated
      .populate({
        path: "houseEntityID",
        populate: [{ path: "landlord" }, { path: "broker" }],
      })
      .exec();

    res.json(pendingOrders);
  } catch (error) {
    console.error("Error getting pending orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Format pending orders with required information
// const formattedPendingOrders = pendingOrders.map((order) => ({
//   tenant: {
//     firstName: order.tenantID.firstName,
//     lastName: order.tenantID.lastName,
//     email: order.tenantID.email,
//     phoneNumber: order.tenantID.phoneNumber,
//     address: order.tenantID.address,
//   },
//   bidPrice: order.bidPrice,
//   dateSubmitted: order.date,
//   house: {
//     location: order.houseEntityID.location,
//   },
// }));
// res.json(formattedPendingOrders);

const acceptPendingOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;
  const role = req.user.role;
  // console.log(userId);
  // console.log(role);

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

  // Check if the user has permission to accept the pending order
  if (
    (role === "Landlord" &&
      houseEntity.landlord.toString() !== userId.toString()) ||
    (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
  ) {
    return res
      .status(403)
      .json({ error: "Unauthorized to accept this pending order" });
  }

  // set the pending order status to approved
  order.status = "Approved";
  await order.save();

  // Update the status of the house to rented
  if (houseEntity) {
    houseEntity.status = "rented";
    await houseEntity.save();
    console.log(houseEntity.status);
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
  //await cancelConflictingPendingOrders(order, order.houseEntityID, order.date);

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
  const userId = req.user._id;
  const role = req.user.role;
  // console.log(userId);
  // console.log(role);

  const order = await PendingOrder.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  // find house
  const houseEntity = await House.findById(order.houseEntityID);

  // Check if the user has permission to reject the pending order
  if (
    (role === "Landlord" &&
      houseEntity.landlord.toString() !== userId.toString()) ||
    (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
  ) {
    return res
      .status(403)
      .json({ error: "Unauthorized to reject this pending order" });
  }

  // set the pending order status to rejected
  order.status = "Rejected";
  await order.save();

  // Send notification to the tenant
  const notificationMessage = "Your rental application has been rejected.";
  const notificationDetails = {
    orderStatus: "Rejected",
    orderId: order._id,
  };

  // await createNotification(
  //   order.tenantID,
  //   notificationMessage,
  //   notificationDetails,
  //   "unread"
  // );

  res.json({ message: "Order rejected successfully" });
});

const proposeCounterOffer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const orderId = req.params.id;
  const newBidPrice = req.body.newBidPrice;

  const order = await PendingOrder.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // find house
  const houseEntity = await House.findById(order.houseEntityID);

  // Check if the user has permission to propose a counter offer
  if (
    (role === "Landlord" &&
      houseEntity.landlord.toString() !== userId.toString()) ||
    (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
  ) {
    return res.status(403).json({
      error: "Unauthorized to propose a counter offer for this pending order",
    });
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

  // await createNotification(
  //   order.tenantID,
  //   notificationMessage,
  //   notificationDetails,
  //   "unread"
  // );

  res.json({ message: "Counter offer proposed successfully" });
});

// to delete pending order
const deletePendingOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract userId and role from req.user
  const role = req.user.role;
  console.log(userId);
  console.log(role);
  const id = req.params.id;

  try {
    // Find the pending order
    const pendingOrder = await PendingOrder.findById(id);
    console.log(pendingOrder);

    // Check if the pending order exists
    if (!pendingOrder) {
      return res.status(404).json({ error: "Pending order not found" });
    }

    // Find the associated house
    const houseEntity = await House.findById(pendingOrder.houseEntityID);

    // Check if the user has permission to delete the pending order
    if (
      (role === "Landlord" &&
        houseEntity.landlord.toString() !== userId.toString()) ||
      (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this pending order" });
    }

    // Delete the pending order
    await pendingOrder.deleteOne({ _id: id });

    //const deletedOrder = await PendingOrder.findByIdAndRemove(req.params.id);
    //res.status(200).json("Deleted successfully");
  } catch (error) {
    console.error("Error deleting pending order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  createPendingOrder,
  getPendingOrders,
  deletePendingOrder,
  acceptPendingOrder,
  rejectPendingOrder,
  proposeCounterOffer,
  getNotifications,
};
>>>>>>> Stashed changes
