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
        type: Buffer
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker'
    },
},
{
    Timestamps: true,
}
)

module.exports = mongoose.model('House', houseSchema)