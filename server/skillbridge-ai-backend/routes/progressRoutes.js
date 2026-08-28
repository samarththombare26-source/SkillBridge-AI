const express = require("express");

const router = express.Router();

const {
    completeLesson,
    getCourseProgress
} = require("../controllers/progressController");

const verifyToken = require("../middleware/authMiddleware");

// Complete lesson
router.post(
    "/complete",
    verifyToken,
    completeLesson
);

// Get course progress
router.get(
    "/:courseId",
    verifyToken,
    getCourseProgress
);

module.exports = router;