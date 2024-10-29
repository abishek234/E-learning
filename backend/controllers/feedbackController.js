const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// Get feedbacks for a specific course
exports.getFeedbacksForCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('feedbacks');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.json(course.feedbacks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
    const { course_id, comment } = req.body;

    try {
        const course = await Course.findById(course_id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const feedback = new Feedback({
            course: course_id,
            comment,
        });

        await feedback.save();

        // Push feedback ID to the course's feedbacks array
        course.feedbacks.push(feedback._id);
        await course.save(); // Save the updated course document

        return res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};