const express = require("express");

const router = express.Router();

const {
    createQuiz,
    getQuizzesByCourse,
    getQuizById,
    updateQuiz,
    deleteQuiz
} = require("../controllers/quizController");

const verifyToken = require("../middleware/authMiddleware");


// ======================================
// GENERATE AI SKILL QUIZ (must be before /:quizId)
// ======================================

router.post(
    "/generate",
    verifyToken,
    require("../controllers/quizController").generateAiQuiz
);

router.post(
    "/evaluate",
    verifyToken,
    require("../controllers/quizController").evaluateQuiz
);

// ======================================
// CREATE QUIZ
// ======================================

router.post(
    "/",
    verifyToken,
    createQuiz
);


// ======================================
// GET QUIZZES BY COURSE
// ======================================

router.get(
    "/course/:courseId",
    verifyToken,
    getQuizzesByCourse
);


// ======================================
// GET SINGLE QUIZ
// ======================================

router.get(
    "/:quizId",
    verifyToken,
    getQuizById
);


// ======================================
// UPDATE QUIZ
// ======================================

router.put(
    "/:quizId",
    verifyToken,
    updateQuiz
);


// ======================================
// DELETE QUIZ
// ======================================

router.delete(
    "/:quizId",
    verifyToken,
    deleteQuiz
);


module.exports = router;