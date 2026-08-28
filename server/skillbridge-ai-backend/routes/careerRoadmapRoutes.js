const express = require("express");

const router = express.Router();

const {

    createCareerRoadmap,

    getCareerRoadmaps,

    getCareerRoadmapById,

    updateCareerRoadmap,

    deleteCareerRoadmap

} = require("../controllers/careerRoadmapController");

const verifyToken =
    require("../middleware/authMiddleware");


// ======================================
// CREATE ROADMAP
// ======================================

router.post(
    "/",
    verifyToken,
    createCareerRoadmap
);


// ======================================
// GET ALL ROADMAPS
// ======================================

router.get(
    "/",
    verifyToken,
    getCareerRoadmaps
);


// ======================================
// GET SINGLE ROADMAP
// ======================================

router.get(
    "/:roadmapId",
    verifyToken,
    getCareerRoadmapById
);


// ======================================
// UPDATE ROADMAP
// ======================================

router.put(
    "/:roadmapId",
    verifyToken,
    updateCareerRoadmap
);


// ======================================
// DELETE ROADMAP
// ======================================

router.delete(
    "/:roadmapId",
    verifyToken,
    deleteCareerRoadmap
);


module.exports = router;