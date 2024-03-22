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
    images: {
        data: Buffer,
        contentType: String
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker'
    },
    availableDates: [
        {
          type: Date,
          required: true,
        },
    ],
    rentalRequests: [
        {
          startDate: {
            type: Date,
            required: true,
          },
          endDate: {
            type: Date,
            required: true,
          },
          renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
        },
      ],
},
{
    Timestamps: true,
}
)

module.exports = mongoose.model('House', houseSchema)