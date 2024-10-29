const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phno: String,
    dob: String,
    gender: String,
    location: String,
    profession: String,
    role: String,
    isInstructor: { type: Boolean, default: false },
    learningCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Learning' }] // Add this line
});

module.exports = mongoose.model('User', userSchema);