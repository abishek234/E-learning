const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    marks: { type: Number, required: true },
});

module.exports = mongoose.model('Assessment', assessmentSchema);