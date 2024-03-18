const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");
const House = require("../models/houseModel");
const Notification = require("../models/notificationModel");

// function to send notification
async function sendNotification(submitterID, status) {
  try {
    // Create a new notification
    const notification = new Notification({
      recipient: submitterID,
      message: `Your report status has been updated to ${status}.`,
    });

    // Save the notification to the database
    await notification.save();

    console.log(`Notification saved for user ${submitterID}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// create a report
const createReport = asyncHandler(async (req, res) => {
  try {
    const { submitterID, houseEntityID, message, reportType } = req.body;

    // Validate input
    if (!submitterID || !houseEntityID || !message || !reportType) {
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

    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get reports for a specific house
const getReports = asyncHandler(async (req, res) => {
  try {
    const { houseEntityID } = req.params;

    // Fetch reports for the specified house
    const reports = await Report.find({ houseEntityID })
      .populate("submitterID", "firstName lastName phoneNumber address email")
      .populate("houseEntityID", "location")
      .select("submitterID houseEntityID message reportType");

    res.json(reports);
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update report status
const updateReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  // Validate input
  if (!reportId || !status || !["Pending", "Resolved"].includes(status)) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  // Find the report by ID
  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  // Update the status of the report
  report.status = status;
  await report.save();

  // Send notification to the submitter
  await sendNotification(report.submitterID, status);

  res.json(report);
});

// delete report by id
const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  // Validate reportId
  if (!reportId) {
    return res.status(400).json({ error: "Invalid report ID" });
  }

  // Find the report by ID
  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  // Delete the report
  await report.remove();

  res.json({ message: "Report deleted successfully" });
});

module.exports = {
  createReport,
  getReports,
  updateReport,
  deleteReport,
};