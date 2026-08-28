
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");


// Mark lesson as completed
const completeLesson = async (req, res) => {

    try {

        const studentId = req.user.id || req.user.userId;

        const { lessonId } = req.body;

        // Find lesson
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {

            return res.status(404).json({
                message: "Lesson not found"
            });

        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: lesson.course
        });

        if (!enrollment) {

            return res.status(403).json({
                message: "You are not enrolled in this course"
            });

        }

        // Find or create progress
        let progress = await Progress.findOne({
            student: studentId,
            course: lesson.course
        });

        if (!progress) {

            progress = await Progress.create({
                student: studentId,
                course: lesson.course,
                completedLessons: []
            });

        }

        // Add lesson if not already completed
      const alreadyCompleted = progress.completedLessons.some(
    (id) => id.toString() === lessonId.toString()
);

if (!alreadyCompleted) {
    progress.completedLessons.push(lessonId);
}

        // Count total lessons
        const totalLessons = await Lesson.countDocuments({
            course: lesson.course
        });

        const completedLessons =
            progress.completedLessons.length;

        // Calculate percentage
        progress.percentage =
            totalLessons === 0
                ? 0
                : Math.round(
                    (completedLessons / totalLessons) * 100
                );

        // Check completion
        progress.completed =
            progress.percentage === 100;

        await progress.save();

        res.status(200).json({
            message: "Lesson completed successfully",
            progress
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update progress",
            error: error.message
        });

    }

};


// Get course progress
const getCourseProgress = async (req, res) => {

    try {

        const studentId = req.user.id || req.user.userId;

        const { courseId } = req.params;

        const progress = await Progress.findOne({
            student: studentId,
            course: courseId
        });

        if (!progress) {

            return res.status(200).json({
                message: "No progress found",
                progress: {
                    percentage: 0,
                    completedLessons: [],
                    completed: false
                }
            });

        }

        res.status(200).json({
            message: "Progress fetched successfully",
            progress
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch progress",
            error: error.message
        });

    }

};


module.exports = {
    completeLesson,
    getCourseProgress
};

