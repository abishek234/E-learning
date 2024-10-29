const Course = require('../models/Course');
const Question = require('../models/Question');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'username');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new course
exports.createCourse = async (req, res) => {
    const { course_name, description, p_link, y_link, instructor } = req.body;

    const newCourse = new Course({
        course_name,    
        p_link,
        instructor,
    });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get courses by instructor name
exports.getCoursesByInstructorId = async (req, res) => {
    const {id} = req.params;
    try {
        const courses = await Course.find({instructor : id}).populate('instructor', 'username');
       
        
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Count courses by instructor name
exports.countCoursesByInstructorId = async (req, res) => {
    const { id } = req.params; // Get instructor ID from request parameters
    try {
        const count = await Course.countDocuments({ instructor: id }); // Count courses where instructor matches the ID
        res.json({ count }); // Return the count in a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};




// Get all questions for a specific course
exports.getAllQuestionsForCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const questions = await Question.find({ course: courseId });
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

