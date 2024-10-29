const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Route definitions
router.put('/update-progress', progressController.updateProgress);
router.get('/:userId/:courseId', progressController.getProgress);
router.put('/update-duration', progressController.updateDuration);
router.get('/completion-stats/:userId', progressController.getCompletionStats);
router.get('/:courseId', progressController.getCoursePerformanceStats);

module.exports = router;