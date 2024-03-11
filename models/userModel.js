const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number },
    location: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin", "broker", "superAdmin", "tenant"],
        default: "user"
    },
    profileImagePath: { type: String, default: "" }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
