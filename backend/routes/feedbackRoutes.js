const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route definitions
router.get('/:courseId', feedbackController.getFeedbacksForCourse);
router.post('/', feedbackController.submitFeedback);

module.exports = router;