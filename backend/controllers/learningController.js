const Learning = require('../models/Learning');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// Get learning courses for a specific user
exports.getLearningCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const learningRecords = await Learning.find({ user: userId }).populate({
                path: 'course',
                populate: {
                    path: 'instructor', // Populate instructor details
                    select: 'username' // Select only the username field
                }
            });
;
        const learningCourses = learningRecords.map(record => record.course);

        return res.json(learningCourses);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all enrollments
exports.getEnrollments = async (req, res) => {
    try {
        const enrollments = await Learning.find().populate('user course');
        return res.json(enrollments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        const existingLearning = await Learning.findOne({ user: userId, course: courseId });

        if (existingLearning) {
            return res.status(400).json({ message: 'Course already enrolled' });
        }

        // Create progress entry (if you have a Progress model)
        const progress = new Progress({ user: userId, course: courseId });
        await progress.save();

        // Create learning entry
        const learning = new Learning({ user: userId, course: courseId });
        await learning.save();

        // Push the learning entry into the user's learningCourses array
        user.learningCourses.push(learning._id);
        await user.save(); // Save the updated user document

        return res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Unenroll from a course
exports.unenrollCourse = async (req, res) => {
    const { id } = req.params;

    try {
        await Learning.findByIdAndDelete(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};