const Discussion = require('../models/Discussion');
const Course = require('../models/Course');
const Sentiment = require('sentiment');
const { sendSummary } = require('../utils/mailer'); 
const cron = require('node-cron');

// Get discussions by course ID
exports.getDiscussionsByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const discussions = await Discussion.find({ course: courseId });
        return res.json(discussions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    const { course_id, name, content } = req.body;

    try {
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Analyze sentiment of the content
        const sentiment = new Sentiment();
        const result = sentiment.analyze(content);
        const sentimentScore = result.score;

        let instructorReview;
        if (sentimentScore > 0) {
            instructorReview = 'Positive feedback';
        } else if (sentimentScore < 0) {
            instructorReview = 'Negative feedback';
        } else {
            instructorReview = 'Neutral feedback';
        }

        const discussion = new Discussion({
            uName: name,
            content,
            course: course_id,
            sentimentScore,
            instructorReview,
        });

        const createdDiscussion = await discussion.save();
        return res.status(201).json(createdDiscussion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Aggregate feedback for a specific course
async function aggregateFeedback(courseId) {
    const discussions = await Discussion.find({ course: courseId });

    let positiveFeedback = [];
    let negativeFeedback = [];
    let neutralFeedback = [];

    discussions.forEach(discussion => {
        if (discussion.sentimentScore > 0) {
            positiveFeedback.push(discussion.content);
        } else if (discussion.sentimentScore < 0) {
            negativeFeedback.push(discussion.content);
        } else {
            neutralFeedback.push(discussion.content);
        }
    });

    return { positiveFeedback, negativeFeedback, neutralFeedback };
}

// Schedule weekly summary for positive and neutral feedback
cron.schedule('30 10 * * 1', async () => { // Every Monday at 10:45 AM
    const courses = await Course.find().populate('instructor'); // Populate instructor details
    for (const course of courses) {
        const { positiveFeedback, neutralFeedback } = await aggregateFeedback(course._id);
        
        const combinedFeedback = [...positiveFeedback, ...neutralFeedback];
        
        if (combinedFeedback.length > 0 && course.instructor && course.instructor.email) {
            const instructorName = course.instructor.username; // Assuming username is the instructor's name
            const feedbackMessage = combinedFeedback.join('\n');
            const emailBody = `Hello ${instructorName},\n\nThere are many reviews for you. Kindly view them below:\n\n${feedbackMessage}`;
            
            sendSummary(course.instructor.email, 
                `Weekly Positive and Neutral Feedback Summary for ${course.course_name}`, 
                emailBody);
        }
    }
});

// Schedule daily summary for negative feedback
cron.schedule('30 10 * * *', async () => { // Every day at 5:45 PM
    const courses = await Course.find().populate('instructor'); // Populate instructor details
    for (const course of courses) {
        const { negativeFeedback } = await aggregateFeedback(course._id);
        
        if (negativeFeedback.length > 0 && course.instructor && course.instructor.email) {
            const instructorName = course.instructor.username; // Assuming username is the instructor's name
            const feedbackMessage = negativeFeedback.join('\n');
            const emailBody = `Hello ${instructorName},\n\nThere need to be some changes based on student feedback. Here are the comments:\n\n${feedbackMessage}`;
            
            sendSummary(course.instructor.email, 
                `Daily Negative Feedback Summary for ${course.course_name}`, 
                emailBody);
        }
    }
});