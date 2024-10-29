const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    uName: {  
        type: String, 
        required: true,
    },
    content: { type: String, required: true },
    sentimentScore: { type: Number, default: 0 }, 
    instructorReview: { type: String, default: '' }, 
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);