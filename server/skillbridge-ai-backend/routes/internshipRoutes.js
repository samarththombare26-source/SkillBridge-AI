const express = require("express");

const router = express.Router();

const {
    createInternship,
    getAllInternships,
    getInternshipById,
    updateInternship,
    deleteInternship
} = require("../controllers/internshipController");

const verifyToken = require("../middleware/authMiddleware");


// ======================================
// CREATE INTERNSHIP
// ======================================

router.post(
    "/",
    verifyToken,
    createInternship
);


// ======================================
// GET ALL INTERNSHIPS
// ======================================

router.get(
    "/",
    verifyToken,
    getAllInternships
);


// ======================================
// GET SINGLE INTERNSHIP
// ======================================

router.get(
    "/:internshipId",
    verifyToken,
    getInternshipById
);


// ======================================
// UPDATE INTERNSHIP
// ======================================

router.put(
    "/:internshipId",
    verifyToken,
    updateInternship
);


// ======================================
// DELETE INTERNSHIP
// ======================================

router.delete(
    "/:internshipId",
    verifyToken,
    deleteInternship
);


module.exports = router;