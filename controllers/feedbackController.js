const Feedback = require('../models/feedbackModel')

exports.getAllFeedbacks = async (req, res) => {
    try{
        const feedbacks = await Feedback.find()
        res.status(200).json(feedbacks)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.newFeedback = async (req, res) => {
    const feedback = new Feedback({
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.body.userId,
        house: req.body.houseId
    })

    try {
        const savedFeedback = await feedback.save()
        res.status(201).json(savedFeedback)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
}