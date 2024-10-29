const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    y_link: { type: String, required: true },
   
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);