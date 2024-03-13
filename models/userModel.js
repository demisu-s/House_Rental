const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number },
    address: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Landlord", "Tenant", "Admin", "Broker", "SuperAdmin"],
        default: "Tenant"
    },
    profileImagePath: { type: String, default: "" },
    blocked: { type: Boolean, default: false }, 
    verified: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
