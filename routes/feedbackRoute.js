const express = require('express');
const router = express.Router();

const {getAllFeedbacks,newFeedback, updateFeedback, deleteFeedback}= require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect, newFeedback); 
router.get('/',protect, getAllFeedbacks);
router.put('/:id',protect,updateFeedback)
router.delete('/id',protect,deleteFeedback)

module.exports=router;