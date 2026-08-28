
const Enrollment = require("../models/Enrollment");

// Enroll in a course
const enrollCourse = async (req, res) => {

    try {

        const { courseId } = req.body;

        // Check course ID
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }

        // Get student ID from JWT
        const studentId = req.user.id || req.user.userId;

        if (!studentId) {
            return res.status(401).json({
                message: "Student ID not found in token"
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "You are already enrolled in this course"
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId
        });

        res.status(201).json({
            message: "Course enrolled successfully",
            enrollment
        });

    } catch (error) {

        console.log("Enrollment Error:", error);

        res.status(500).json({
            message: "Enrollment failed",
            error: error.message
        });

    }

};


// Get student's enrolled courses
const getMyEnrollments = async (req, res) => {

    try {

        const studentId = req.user.id || req.user.userId;

        if (!studentId) {
            return res.status(401).json({
                message: "Student ID not found in token"
            });
        }

        const enrollments = await Enrollment.find({
            student: studentId
        }).populate("course");

        res.status(200).json({
            message: "Enrollments fetched successfully",
            enrollments
        });

    } catch (error) {

        console.log("Get Enrollment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};


module.exports = {
    enrollCourse,
    getMyEnrollments
};

