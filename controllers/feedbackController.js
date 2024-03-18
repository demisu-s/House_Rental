const Feedback = require('../models/feedbackModel')

const getAllFeedbacks = async (req, res) => {
    try{
        const feedbacks = await Feedback.find()
        res.status(200).json(feedbacks)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getFeedbackById = async (req,res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
        if(!feedback)
            return res.status(404).json({message: 'Feedback not found'})
        else
            res.status(200).json(house)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
}

const newFeedback = async (req, res) => {
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

const updateFeedback = async (req, res) => {
    const feedback = {
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.body.userId,
        house: req.body.houseId
    }

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, feedback, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteFeedback = async (req, res) => {
    try {
      await Feedback.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}
module.exports={
    newFeedback,
    getFeedbackById,
    getAllFeedbacks,
    updateFeedback,
    deleteFeedback

}