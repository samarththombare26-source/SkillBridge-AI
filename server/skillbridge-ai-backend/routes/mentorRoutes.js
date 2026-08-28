const express = require("express");

const router = express.Router();


const {

    createMentor,

    getMentors,

    getMentorById,

    getMyMentorProfile,

    updateMyMentorProfile,

    deleteMyMentorProfile,

    sendMentorRequest,

    getMyMentorRequests,

    getMentorRequests,

    acceptMentorRequest,

    rejectMentorRequest,

    getMyMentors,

    getMyStudents

} = require("../controllers/mentorController");


const verifyToken =
    require("../middleware/authMiddleware");


// ======================================
// CREATE MENTOR PROFILE
// POST /api/mentor
// ======================================

router.post(
    "/",
    verifyToken,
    createMentor
);




// ======================================
// GET ALL MENTORS
// GET /api/mentor
// ======================================

router.get(
    "/",
    verifyToken,
    getMentors
);


// ======================================
// GET MY MENTOR REQUESTS
// STUDENT
// GET /api/mentor/my-requests
//
// IMPORTANT:
// This MUST come before /:mentorId
// ======================================

router.get(
    "/my-requests",
    verifyToken,
    getMyMentorRequests
);


// ======================================
// GET MENTOR REQUESTS
// MENTOR
// GET /api/mentor/mentor-requests
//
// IMPORTANT:
// This MUST also come before /:mentorId
// ======================================

router.get(
    "/mentor-requests",
    verifyToken,
    getMentorRequests
);


// ======================================
// SEND MENTOR REQUEST
// POST /api/mentor/request
// ======================================

router.post(
    "/request",
    verifyToken,
    sendMentorRequest
);


// ======================================
// GET SINGLE MENTOR
// GET /api/mentor/:mentorId
//
// KEEP THIS LAST
// ======================================

// ======================================
// ACCEPT MENTOR REQUEST
// PATCH /api/mentor/request/:requestId/accept
// ======================================

router.patch(
    "/request/:requestId/accept",
    verifyToken,
    acceptMentorRequest
);


// ======================================
// REJECT MENTOR REQUEST
// PATCH /api/mentor/request/:requestId/reject
// ======================================

router.patch(
    "/request/:requestId/reject",
    verifyToken,
    rejectMentorRequest
);


// ======================================
// GET MY CONNECTED MENTORS
// STUDENT
// GET /api/mentor/my-mentors
// ======================================

router.get(
    "/my-mentors",
    verifyToken,
    getMyMentors
);


// ======================================
// GET MY CONNECTED STUDENTS
// MENTOR
// GET /api/mentor/my-students
// ======================================

router.get(
    "/my-students",
    verifyToken,
    getMyStudents
);

// ======================================
// GET MY MENTOR PROFILE
// GET /api/mentor/profile
// ======================================

router.get(
    "/profile",
    verifyToken,
    getMyMentorProfile
);


// ======================================
// UPDATE MY MENTOR PROFILE
// PUT /api/mentor/profile
// ======================================

router.put(
    "/profile",
    verifyToken,
    updateMyMentorProfile
);


// ======================================
// DELETE MY MENTOR PROFILE
// DELETE /api/mentor/profile
// ======================================

router.delete(
    "/profile",
    verifyToken,
    deleteMyMentorProfile
);

router.get(
    "/:mentorId",
    verifyToken,
    getMentorById
);


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;