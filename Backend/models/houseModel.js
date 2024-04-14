const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    address: {
        type: String,
        required: true
    },
    square_feet: {type:String},
    bedrooms:{ type:String
    },
    bathrooms: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    property_type: String,
    houseImagePaths: {
        type: [String], // Array of image paths
        default: []
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the user model
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user model
    },
    availability: {
        status: {
            type: String,
            enum: ["available", "rented", "unavailable"],
            default: "available",
        },
        unavailablePeriods: [{
            fromDate: Date,
            toDate: Date,
            reason: String
        }]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('House', houseSchema);
