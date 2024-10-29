const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Route definitions
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/instructor/:id', courseController.getCoursesByInstructorId);
router.get('/instructor/count/:id', courseController.countCoursesByInstructorId);
router.get('/question/courses/:courseId', courseController.getAllQuestionsForCourse);


module.exports = router;