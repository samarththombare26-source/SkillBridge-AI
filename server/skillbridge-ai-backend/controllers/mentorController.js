const Mentor = require("../models/Mentor");
const MentorRequest = require("../models/MentorRequest");
const Notification = require("../models/Notification");

// ======================================
// CREATE MENTOR PROFILE
// ======================================

const createMentor = async (req, res) => {

    try {

        const {
            name,
            email,
            expertise,
            experience,
            bio,
            linkedin,
            availability
        } = req.body;

        if (
            !name ||
            !email ||
            !expertise ||
            !experience ||
            !bio
        ) {

            return res.status(400).json({
                message: "All required mentor fields are required"
            });

        }

        const existingMentor =
            await Mentor.findOne({
                user: req.user.id
            });

        if (existingMentor) {

            return res.status(400).json({
                message: "Mentor profile already exists"
            });

        }

        const mentor = await Mentor.create({

            user: req.user.id,

            name,

            email,

            expertise,

            experience,

            bio,

            linkedin,

            availability

        });

        res.status(201).json({

            message:
                "Mentor profile created successfully",

            mentor

        });

    } catch (error) {

        console.log(
            "Create Mentor Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create mentor profile",

            error: error.message

        });

    }

};


// ======================================
// GET ALL MENTORS
// ======================================

const getMentors = async (req, res) => {

    try {

        const mentors =
            await Mentor.find()
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            message:
                "Mentors fetched successfully",

            mentors

        });

    } catch (error) {

        console.log(
            "Get Mentors Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch mentors",

            error: error.message

        });

    }

};


// ======================================
// GET SINGLE MENTOR
// ======================================

const getMentorById = async (req, res) => {

    try {

        const mentor =
            await Mentor.findById(
                req.params.mentorId
            )
            .populate(
                "user",
                "name email"
            );

        if (!mentor) {

            return res.status(404).json({

                message:
                    "Mentor not found"

            });

        }

        res.status(200).json({

            message:
                "Mentor fetched successfully",

            mentor

        });

    } catch (error) {

        console.log(
            "Get Mentor Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch mentor",

            error: error.message

        });

    }

};


// ======================================
// SEND MENTOR REQUEST
// ======================================

const sendMentorRequest = async (req, res) => {

    try {

        const {
            mentorId,
            message
        } = req.body;

        if (!mentorId || !message) {

            return res.status(400).json({

                message:
                    "Mentor and message are required"

            });

        }

        const mentor =
            await Mentor.findById(
                mentorId
            );

        if (!mentor) {

            return res.status(404).json({

                message:
                    "Mentor not found"

            });

        }

        const existingRequest =
            await MentorRequest.findOne({

                student: req.user.id,

                mentor: mentorId,

                status: "Pending"

            });

        if (existingRequest) {

            return res.status(400).json({

                message:
                    "You already have a pending request with this mentor"

            });

        }

        const request =
            await MentorRequest.create({

                student: req.user.id,

                mentor: mentorId,

                message

            });

        // ======================================
        // CREATE NOTIFICATION FOR MENTOR
        // ======================================

        await Notification.create({

            user: mentor.user,

            message:
                "You have received a new mentor request.",

            type:
                "mentor_request",

            relatedId:
                request._id

        });

        res.status(201).json({

            message:
                "Mentorship request sent successfully",

            request

        });

    } catch (error) {

        console.log(
            "Mentor Request Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to send mentorship request",

            error: error.message

        });

    }

};


// ======================================
// GET MY MENTOR REQUESTS
// STUDENT
// ======================================

const getMyMentorRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await MentorRequest.find({

                student: req.user.id

            })
            .populate(
                "mentor",
                "name expertise experience"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({

            message:
                "Mentor requests fetched successfully",

            requests

        });

    } catch (error) {

        console.log(
            "My Mentor Requests Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch mentor requests",

            error: error.message

        });

    }

};


// ======================================
// GET MENTOR REQUESTS
// MENTOR
// ======================================

const getMentorRequests = async (
    req,
    res
) => {

    try {

        const mentor =
            await Mentor.findOne({

                user: req.user.id

            });

        if (!mentor) {

            return res.status(404).json({

                message:
                    "Mentor profile not found"

            });

        }

        const requests =
            await MentorRequest.find({

                mentor: mentor._id

            })
            .populate(
                "student",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({

            message:
                "Requests fetched successfully",

            requests

        });

    } catch (error) {

        console.log(
            "Get Mentor Requests Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch mentor requests",

            error: error.message

        });

    }

};


// ======================================
// ACCEPT MENTOR REQUEST
// ======================================

const acceptMentorRequest = async (req, res) => {

    try {

        const { requestId } = req.params;

        const mentor = await Mentor.findOne({
            user: req.user.id
        });

        if (!mentor) {

            return res.status(404).json({
                message: "Mentor profile not found"
            });

        }

        const request =
            await MentorRequest.findOne({
                _id: requestId,
                mentor: mentor._id
            });

        if (!request) {

            return res.status(404).json({
                message: "Mentor request not found"
            });

        }

        request.status = "Accepted";

        await request.save();

        // ======================================
        // CREATE NOTIFICATION FOR STUDENT
        // ======================================

        await Notification.create({

            user: request.student,

            message:
                "Your mentor request has been accepted.",

            type:
                "mentor_request_accepted",

            relatedId:
                request._id

        });

        res.status(200).json({

            message:
                "Mentorship request accepted successfully",

            request

        });

    } catch (error) {

        console.log(
            "Accept Mentor Request Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to accept mentor request",

            error: error.message

        });

    }

};


// ======================================
// REJECT MENTOR REQUEST
// ======================================

const rejectMentorRequest = async (req, res) => {

    try {

        const { requestId } = req.params;

        const mentor = await Mentor.findOne({
            user: req.user.id
        });

        if (!mentor) {

            return res.status(404).json({
                message: "Mentor profile not found"
            });

        }

        const request =
            await MentorRequest.findOne({
                _id: requestId,
                mentor: mentor._id
            });

        if (!request) {

            return res.status(404).json({
                message: "Mentor request not found"
            });

        }

        request.status = "Rejected";

        await request.save();

        // ======================================
        // CREATE NOTIFICATION FOR STUDENT
        // ======================================

        await Notification.create({

            user: request.student,

            message:
                "Your mentor request has been rejected.",

            type:
                "mentor_request_rejected",

            relatedId:
                request._id

        });

        res.status(200).json({

            message:
                "Mentorship request rejected successfully",

            request

        });

    } catch (error) {

        console.log(
            "Reject Mentor Request Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to reject mentor request",

            error: error.message

        });

    }

};


// ======================================
// GET MY CONNECTED MENTORS
// STUDENT
// ======================================

const getMyMentors = async (req, res) => {

    try {

        const requests =
            await MentorRequest.find({

                student: req.user.id,

                status: "Accepted"

            })
            .populate(
                "mentor",
                "name email expertise experience bio linkedin availability"
            )
            .sort({
                createdAt: -1
            });

        const mentors = requests
            .map((request) => request.mentor)
            .filter((mentor) => mentor);

        res.status(200).json({

            message:
                "Connected mentors fetched successfully",

            mentors

        });

    } catch (error) {

        console.log(
            "Get My Mentors Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch connected mentors",

            error: error.message

        });

    }

};


// ======================================
// GET MY CONNECTED STUDENTS
// MENTOR
// ======================================

const getMyStudents = async (req, res) => {

    try {

        const mentor =
            await Mentor.findOne({

                user: req.user.id

            });

        if (!mentor) {

            return res.status(404).json({

                message:
                    "Mentor profile not found"

            });

        }

        const requests =
            await MentorRequest.find({

                mentor: mentor._id,

                status: "Accepted"

            })
            .populate(
                "student",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        const students = requests
            .map((request) => request.student)
            .filter((student) => student);

        res.status(200).json({

            message:
                "Connected students fetched successfully",

            students

        });

    } catch (error) {

        console.log(
            "Get My Students Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch connected students",

            error: error.message

        });

    }

};


// ======================================
// GET MY MENTOR PROFILE
// GET /api/mentor/profile
// ======================================

const getMyMentorProfile = async (req, res) => {

    try {

        const mentor = await Mentor.findOne({
            user: req.user.id
        });

        if (!mentor) {

            return res.status(404).json({

                message: "Mentor profile not found"

            });

        }

        res.status(200).json({

            message: "Mentor profile fetched successfully",

            mentor

        });

    } catch (error) {

        console.log(
            "Get My Mentor Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch mentor profile",

            error: error.message

        });

    }

};


// ======================================
// UPDATE MY MENTOR PROFILE
// PUT /api/mentor/profile
// ======================================

const updateMyMentorProfile = async (req, res) => {

    try {

        const {
            name,
            email,
            expertise,
            experience,
            bio,
            linkedin,
            availability
        } = req.body;

        const mentor = await Mentor.findOne({
            user: req.user.id
        });

        if (!mentor) {

            return res.status(404).json({

                message: "Mentor profile not found"

            });

        }

        if (name !== undefined) {
            mentor.name = name;
        }

        if (email !== undefined) {
            mentor.email = email;
        }

        if (expertise !== undefined) {
            mentor.expertise = expertise;
        }

        if (experience !== undefined) {
            mentor.experience = experience;
        }

        if (bio !== undefined) {
            mentor.bio = bio;
        }

        if (linkedin !== undefined) {
            mentor.linkedin = linkedin;
        }

        if (availability !== undefined) {
            mentor.availability = availability;
        }

        await mentor.save();

        res.status(200).json({

            message:
                "Mentor profile updated successfully",

            mentor

        });

    } catch (error) {

        console.log(
            "Update Mentor Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update mentor profile",

            error: error.message

        });

    }

};


// ======================================
// DELETE MY MENTOR PROFILE
// DELETE /api/mentor/profile
// ======================================

const deleteMyMentorProfile = async (req, res) => {

    try {

        const mentor = await Mentor.findOne({
            user: req.user.id
        });

        if (!mentor) {

            return res.status(404).json({

                message: "Mentor profile not found"

            });

        }

        await Mentor.findByIdAndDelete(
            mentor._id
        );

        res.status(200).json({

            message:
                "Mentor profile deleted successfully"

        });

    } catch (error) {

        console.log(
            "Delete Mentor Profile Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete mentor profile",

            error: error.message

        });

    }

};


// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports = {

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

};