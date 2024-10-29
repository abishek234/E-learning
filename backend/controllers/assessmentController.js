const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Course = require('../models/Course');

// Get assessments by user and course
exports.getAssessmentsByUserAndCourse = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        const assessments = await Assessment.find({ user: userId, course: courseId }).populate('course', 'course_name'); // Populate course name
        return res.json(assessments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get assessments by user
exports.getAssessmentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const assessments = await Assessment.find({ user: userId }).populate('course', 'course_name'); // Populate course name
        return res.json(assessments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Add assessment with marks
// Add assessment with marks
exports.addAssessmentWithMarks = async (req, res) => {
    const { userId, courseId } = req.params;
    const assessmentData = req.body;

    try {
        // Check if user and course exist
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        // Find existing assessments for the user and course
        let existingAssessments = await Assessment.find({ user: userId, course: courseId });

        if (existingAssessments.length > 0) {
            let existingAssessment = existingAssessments[0];

            // Update marks only if the new marks are higher
            if (assessmentData.marks > existingAssessment.marks) {
                existingAssessment.marks = assessmentData.marks;
                await existingAssessment.save();
                return res.status(200).json(existingAssessment);
            } else {
                // New marks are equal or lower; do nothing and return existing assessment
                return res.status(200).json(existingAssessment);
            }
        } else {
            // Create a new assessment if none exists
            const newAssessment = new Assessment({
                ...assessmentData,
                user: userId,
                course: courseId,
            });

            const savedAssessment = await newAssessment.save();
            return res.status(201).json(savedAssessment);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Get marks by user and course
exports.getMarksByUserAndCourse = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        const assessments = await Assessment.find({ user: userId, course: courseId });
        let totalMarks = 0;

        if (assessments.length > 0) {
            totalMarks = assessments[0].marks;
        }

        return res.json({ totalMarks });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
