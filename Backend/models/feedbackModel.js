const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
    }
},
{
    Timestamps: true
}
)

module.exports = mongoose.model('Feedback', feedbackSchema)