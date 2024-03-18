const express = require('express');
const router = express.Router();

const {getAllFeedbacks,newFeedback}= require('../controllers/feedbackController')

router.get('/',getAllFeedbacks);
router.post('/',newFeedback);  