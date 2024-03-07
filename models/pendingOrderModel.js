const mongoose = require("mongoose");

const PendingOrderSchema = new mongoose.Schema(
  {
    tenantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bidPrice: {
      type: Number,
      required: true,
    },
    houseEntityID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PendingOrder", PendingOrderSchema);
