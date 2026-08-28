const express = require("express");

const router = express.Router();


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ==========================================
// CONTROLLER
// ==========================================

const {
    generateCareerRecommendation,
    getMyCareerRecommendations
} = require("../controllers/careerController");


// ==========================================
// GENERATE CAREER RECOMMENDATION
// ==========================================

router.post(
    "/recommend",
    authMiddleware,
    generateCareerRecommendation
);


// ==========================================
// GET MY RECOMMENDATIONS
// ==========================================

router.get(
    "/my-recommendations",
    authMiddleware,
    getMyCareerRecommendations
);


module.exports = router;