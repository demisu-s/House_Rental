const mongoose = require("mongoose");
const User = require("../models/userModel");

const HouseSchema = new mongoose.Schema(
  {
    // need to add some tasks
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // photo: {

    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("House", HouseSchema);
