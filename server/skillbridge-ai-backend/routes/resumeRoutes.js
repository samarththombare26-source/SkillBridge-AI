const express = require("express");

const router = express.Router();

const {
    saveResume,
    getMyResume,
    deleteResume
} = require("../controllers/resumeController");

const verifyToken = require("../middleware/authMiddleware");


// ======================================
// CREATE / UPDATE RESUME
// ======================================

router.post(
    "/",
    verifyToken,
    saveResume
);


// ======================================
// GET MY RESUME
// ======================================

router.get(
    "/my-resume",
    verifyToken,
    getMyResume
);


// ======================================
// DELETE MY RESUME
// ======================================

router.delete(
    "/my-resume",
    verifyToken,
    deleteResume
);


module.exports = router;