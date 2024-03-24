const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");
const House = require("../models/houseModel");
const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");

// function to send notification
async function sendNotification(submitterID, status) {
  try {
    // Create a new notification
    const notification = new Notification({
      recipient: submitterID,
      message: `Your report status has been updated to ${status}.`,
      details: `Report recieved`,
      status: "unread", // Set the initial status to unread
    });

    // Save the notification to the database
    await notification.save();

    // Mark the notification as read after saving
    // notification.status = "read";
    // await notification.save();

    // console.log(`Notification saved for user ${submitterID}`);
    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// create a report
const createReport = asyncHandler(async (req, res) => {
  try {
    const { submitterID, houseEntityID, message, reportType, role } = req.body;

    // Validate input
    if (!submitterID || !houseEntityID || !message || !reportType || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the report
    const report = new Report({
      submitterID,
      houseEntityID,
      message,
      reportType,
    });

    // Save the report
    await report.save();
    console.log(report);

    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  get reports for a specific house
const getReportByID = asyncHandler(async (req, res) => {
  try {
    //const { houseEntityID } = req.params;
    const houseEntityID = req.params.id;
    console.log(houseEntityID);

    // Convert houseEntityID to ObjectId
    const houseId = new mongoose.Types.ObjectId(houseEntityID);

    // Fetch reports for the specified house
    const reports = await Report.find({ houseEntityID: houseId })
      .populate("submitterID", "firstName lastName phoneNumber address email")
      .populate("houseEntityID", "location")
      .select("submitterID houseEntityID message reportType");

    // Log populated fields

    reports.forEach((report) => {
      console.log("Submitter:", report.submitterID);
      console.log("House Entity:", report.houseEntityID);
    });

    // Check if reports are found for the specified house
    if (reports.length === 0) {
      return res
        .status(404)
        .json({ error: "No reports found for the specified house entity ID" });
    }

    res.json(reports);
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const getReports = asyncHandler(async (req, res) => {
//   try {
//     const { houseEntityID } = req.params;

//     // Fetch reports for the specified house
//     const reports = await Report.find({ houseEntityID })
//       .populate("submitterID", "firstName lastName phoneNumber address email")
//       .populate("houseEntityID", "location")
//       .select("submitterID houseEntityID message reportType");
//     console.log(reports);
//     res.json(reports);
//   } catch (error) {
//     console.error("Error getting reports:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Update report status
const updateReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  console.log(userId);
  console.log(role);
  const reportId = req.params.id;
  const status = req.body.status;
  // Validate input
  if (!reportId || !status) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  // Check if the status is valid
  if (status !== "Pending" && status !== "Resolved") {
    return res.status(400).json({
      error:
        "Invalid status value. Status must be either 'Pending' or 'Resolved'.",
    });
  }

  // Find the report by ID
  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  // find house
  const houseEntity = await House.findById(report.houseEntityID);
  console.log(houseEntity);
  // Check if the user has permission to update the report
  if (
    (role === "Landlord" &&
      houseEntity.landlord.toString() !== userId.toString()) ||
    (role === "Broker" && houseEntity.broker.toString() !== userId.toString())
  ) {
    return res.status(403).json({ error: "Unauthorized to update report" });
  }

  // Update the status of the report
  report.status = status;
  await report.save();

  // Send notification to the submitter
  const notif = await sendNotification(report.submitterID, status);
  console.log(notif);

  res.json(report);
});

// delete report by id
const deleteReport = asyncHandler(async (req, res) => {
  const reportId = req.params.id;
  console.log(reportId);

  // Validate reportId
  if (!reportId) {
    return res.status(400).json({ error: "Invalid report ID" });
  }

  // Find the report by ID
  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  try {
    // Delete the report
    await report.remove();

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Internal server error" });
  }

  // res.json({ message: "Report deleted successfully" });
});

// get reports or all houses registered by landlord or broker
const getReportsBySubmitterId = asyncHandler(async (req, res) => {
  const submitterId = req.params.id;
  console.log(submitterId);
  //
  try {
    // Find houses registered by the submitter
    // const houses = await House.find({ submitterID: submitterId }).select("_id");
    const houses = await House.find({
      $or: [{ broker: submitterId }, { landlord: submitterId }],
    }).select("_id");

    console.log("hii");
    console.log(houses);

    // Extract house IDs from the houses array
    const houseIds = houses.map((house) => house._id);
    console.log(houseIds);

    // Retrieve reports associated with the found house IDs
    const reports = await Report.find({ houseEntityID: { $in: houseIds } })
      .populate("submitterID", "firstName lastName phoneNumber address email")
      .populate("houseEntityID", "location")
      .select("submitterID houseEntityID message reportType status")
      .exec();

    // Check if reports are found for the specified submitter ID
    if (reports.length === 0) {
      return res
        .status(404)
        .json({ error: "No reports found for the specified submitter ID" });
    }

    res.json(reports);
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve unread notifications for the user
    const notifications = await Notification.find({
      recipient: userId,
      status: "unread",
    });

    // Mark notifications as read
    await Notification.updateMany(
      { recipient: userId, status: "unread" },
      { status: "read" }
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  createReport,
  getReportByID,
  updateReport,
  deleteReport,
  getNotifications,
  getReportsBySubmitterId,
};
