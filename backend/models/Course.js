const mongoose = require('mongoose');
const Material = require('./Material');

const courseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    p_link: { type: String },
    Material: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Course', courseSchema);