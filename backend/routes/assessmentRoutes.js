const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// Route definitions
router.get('/user/:userId/course/:courseId', assessmentController.getAssessmentsByUserAndCourse);
router.get('/performance/:userId', assessmentController.getAssessmentsByUser);
router.post('/add/:userId/:courseId', assessmentController.addAssessmentWithMarks);
router.get ('/marks/:userId/:courseId', assessmentController.getAssessmentsByUserAndCourse);

module.exports = router;