const express = require("express");

const router = express.Router();

const {
    applyForInternship,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require(
    "../controllers/internshipApplicationController"
);

const verifyToken = require(
    "../middleware/authMiddleware"
);


// ======================================
// STUDENT APPLY
// ======================================

router.post(
    "/apply",
    verifyToken,
    applyForInternship
);


// ======================================
// STUDENT APPLICATIONS
// ======================================

router.get(
    "/my-applications",
    verifyToken,
    getMyApplications
);


// ======================================
// ADMIN - ALL APPLICATIONS
// ======================================

router.get(
    "/",
    verifyToken,
    getAllApplications
);


// ======================================
// ADMIN - UPDATE STATUS
// ======================================

router.put(
    "/:applicationId/status",
    verifyToken,
    updateApplicationStatus
);


module.exports = router;