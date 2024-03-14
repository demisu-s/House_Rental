const mongoose = require('mongoose')
const houseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    square_feet: {
        type: Number,
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    property_type: {
        type: String
    },
    houseImagePaths: {
        type: Buffer,
        default:""
    },
   
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'//Reference to the user model
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
},
{
    Timestamps: true,
}
)

module.exports = mongoose.model('House', houseSchema)