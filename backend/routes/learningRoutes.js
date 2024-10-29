const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

// Route definitions
router.get('/:userId', learningController.getLearningCourses);
router.get('/', learningController.getEnrollments);
router.post('/', learningController.enrollCourse);
router.delete('/:id', learningController.unenrollCourse);

module.exports = router;