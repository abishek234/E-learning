const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    playedTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    completedVideos: { type: [String], default: [] }, // Array of completed video IDs
});

module.exports = mongoose.model('Progress', progressSchema);