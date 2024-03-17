
const HouseSchema = new mongoose.Schema(
  {
    // need to add some taskss
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
      //required: true,
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      //required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("House", HouseSchema);
