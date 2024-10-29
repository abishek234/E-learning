const Question = require('../models/Question');
const Course = require('../models/Course');

// Add a new question
exports.addQuestion = async (req, res) => {
    const { question, option1, option2, option3, option4, answer, courseId } = req.body;

    try {
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const newQuestion = new Question({
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
            course: courseId,
        });

        // Save the new question
        const savedQuestion = await newQuestion.save();
       
        course.questions.push(savedQuestion._id);
        await course.save(); // Ensure the updated course is saved

        return res.status(201).json({ message: 'Question added successfully', question: savedQuestion });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

// Get all questions across all courses
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('course', 'course_name'); // Populate course name
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { question, option1, option2, option3, option4, answer } = req.body;

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, { question, option1, option2, option3, option4, answer }, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json(updatedQuestion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json(question);

    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}

