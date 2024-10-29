const Progress = require('../models/Progress');
const User = require('../models/User');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const mongoose = require('mongoose');



// Update progress
exports.updateProgress = async (req, res) => {
    const { userId, courseId, playedTime, duration, videoId } = req.body;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        let progress = await Progress.findOne({ user: userId, course: courseId });

        if (progress) {
            if (progress.playedTime === 0 || progress.playedTime <= playedTime) {
                progress.playedTime = playedTime;
                progress.duration = duration;

                // Add video ID to completedVideos if not already present
                if (!progress.completedVideos.includes(videoId)) {
                    progress.completedVideos.push(videoId);
                }

                await progress.save();
                return res.status(200).json({ message: 'Progress updated successfully' });
            } else {
                return res.status(409).json({ message: 'Invalid playedTime' });
            }
        } else {
            // Create new progress if it doesn't exist
            progress = new Progress({ user: userId, course: courseId, playedTime, duration, completedVideos: [videoId] });
            await progress.save();
            return res.status(201).json({ message: 'Progress created successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get progress
exports.getProgress = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const progress = await Progress.findOne({ user: userId, course: courseId });

        if (progress) {
            // Return the entire progress object or specific fields as needed
            return res.json({
                playedTime: progress.playedTime,
                duration: progress.duration,
                completedVideos: progress.completedVideos
            });
        }
        
        return res.status(404).json({ message: 'Progress not found' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update duration
exports.updateDuration = async (req, res) => {
    const { userId, courseId, duration } = req.body;

    try {
        const progress = await Progress.findOne({ user: userId, course: courseId });

        if (progress) {
            progress.duration = duration;
            await progress.save();
            return res.status(200).json({ message: 'Duration updated successfully' });
        } else {
            return res.status(404).json({ message: 'Progress not found for the given user and course' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getCompletionStats = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    try {
        const studentId = mongoose.Types.ObjectId(userId);

        // Fetch all courses
        const courses = await Course.find();

        // Fetch progress for the user
        const progressData = await Progress.find({ user: studentId });

        // Create a map to hold completion stats
        const completionStats = courses.map(course => {
            const progress = progressData.find(p => p.course.toString() === course._id.toString());
            const totalVideos = course.materials.length; // Assuming materials is an array of video IDs or similar
            const completedVideosCount = progress ? progress.completedVideos.length : 0;
            const completionPercentage = totalVideos > 0 ? (completedVideosCount / totalVideos) * 100 : 0;

            return {
                courseId: course._id,
                courseName: course.course_name,
                completionPercentage: Math.round(completionPercentage), // Round to nearest whole number
                completedVideos: completedVideosCount,
                totalVideos: totalVideos,
            };
        });

        return res.status(200).json(completionStats);
    } catch (error) {
        console.error("Error fetching completion stats:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getCoursePerformanceStats = async (req, res) => {
    const { courseId } = req.params; // Extract courseId from params
    

    try {
        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        // Fetch the course
        const course = await Course.findById(courseId).populate('course_name');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch all users registered for this course
        const users = await User.find({ learningCourses: courseId }); // Adjusted to use learningCourses
       

        // Fetch progress data for the course
        const progressData = await Progress.find({ course: courseId });
       
        // Calculate performance stats
        const totalStudents = users.length; // Should reflect actual number of users found
        const completedStudents = progressData.filter(progress => 
            progress.completedVideos && 
            Array.isArray(progress.completedVideos) && 
            progress.completedVideos.length === (course.Material ? course.Material.length : 0) // Check if Material is defined and is an array
        ).length;
        const totalMaterials = course.Material ? course.Material.length : 0;

        const totalVideosWatched = progressData.reduce((acc, progress) => {
            return acc + (Array.isArray(progress.completedVideos) ? progress.completedVideos.length : 0); // Ensure completedVideos is an array
        }, 0);
        
        const totalAssessmentsCompleted = await Assessment.countDocuments({ course: courseId }); // Assuming you have an Assessment model

        return res.status(200).json({
            course,
            totalStudents,
            completedStudents,
            totalVideosWatched,
            totalMaterials,
            totalAssessmentsCompleted,
            completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
            averageMarks: await getAverageMarks(courseId) // Function to calculate average marks
        });
    } catch (error) {
        console.error("Error fetching course performance stats:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Helper function to calculate average marks
async function getAverageMarks(courseId) {
    const assessments = await Assessment.find({ course: courseId });
    if (assessments.length === 0) return 0;

    const totalMarks = assessments.reduce((acc, assessment) => acc + assessment.marks, 0);
    return Math.round(totalMarks / assessments.length);
}