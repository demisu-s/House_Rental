const mongoose = require("mongoose");

const PendingOrderSchema = new mongoose.Schema(
  {
    tenantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
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
      enum: ["Pending", "Approved", "Rejected", "Proposed", "Cancelled"],
      default: "Pending",
    },
    role: {
      type: String,
      enum: ["Landlord", "Tenant", "Admin", "Broker", "SuperAdmin"],
      default: "Tenant",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PendingOrder", PendingOrderSchema);
