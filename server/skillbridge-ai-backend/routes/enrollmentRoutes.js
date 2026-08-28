
const express = require("express");

const router = express.Router();

const {
    enrollCourse,
    getMyEnrollments
} = require("../controllers/enrollmentController");

const verifyToken = require("../middleware/authMiddleware");


// Enroll in course
router.post(
    "/enroll",
    verifyToken,
    enrollCourse
);


// Get my enrolled courses
router.get(
    "/my-enrollments",
    verifyToken,
    getMyEnrollments
);


module.exports = router;

