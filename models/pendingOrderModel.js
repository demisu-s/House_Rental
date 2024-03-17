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
      validate: {
        validator: (value) => value > 0,
        message: "Bid price must be a positive number",
      },
    },
    houseEntityID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Proposed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PendingOrder", PendingOrderSchema);

