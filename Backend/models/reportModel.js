const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    submitterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    houseEntityID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", ReportSchema);