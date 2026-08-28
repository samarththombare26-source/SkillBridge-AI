
const express = require("express");

const router = express.Router();

const {
    createLesson,
    getLessonsByCourse,
    getAllLessons,
    updateLesson,
    deleteLesson
} = require("../controllers/lessonController");


// Create lesson
router.post("/", createLesson);


// Get all lessons
router.get("/", getAllLessons);


// Get lessons for one course
router.get("/course/:courseId", getLessonsByCourse);


// Update lesson
router.put("/:lessonId", updateLesson);


// Delete lesson
router.delete("/:lessonId", deleteLesson);


module.exports = router;

