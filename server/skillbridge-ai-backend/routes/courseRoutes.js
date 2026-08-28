
const express = require("express");

const router = express.Router();

const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");


// Get all courses
router.get("/", getCourses);


// Create course
router.post("/", createCourse);


// Update course
router.put("/:courseId", updateCourse);


// Delete course
router.delete("/:courseId", deleteCourse);


module.exports = router;

