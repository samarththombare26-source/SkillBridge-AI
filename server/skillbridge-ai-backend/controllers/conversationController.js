const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Mentor = require("../models/Mentor");
const MentorRequest = require("../models/MentorRequest");
const User = require("../models/User");

// ======================================
// CREATE / GET CONVERSATION
// ======================================

// ======================================
// CREATE / GET CONVERSATION
// STUDENT + MENTOR
// ======================================

const createConversation = async (req, res) => {

    try {

        console.log("========== CREATE CONVERSATION ==========");
        console.log("Logged in user:", req.user.id);
        console.log("Request body:", req.body);

        const {
            mentorId,
            studentId
        } = req.body;


        // =====================================================
        // STUDENT → MENTOR
        // =====================================================

        if (mentorId) {

            console.log(
                "Student is contacting mentor:",
                mentorId
            );

            const mentor =
                await Mentor.findById(mentorId);

            if (!mentor) {

                return res.status(404).json({
                    message: "Mentor not found"
                });

            }


            console.log(
                "Mentor found:",
                mentor._id
            );


            // Check whether this student and mentor
            // have an accepted mentorship request

            const acceptedRequest =
                await MentorRequest.findOne({

                    student: req.user.id,

                    mentor: mentorId,

                    status: "Accepted"

                });


            console.log(
                "Accepted mentor request:",
                acceptedRequest
            );


            if (!acceptedRequest) {

                return res.status(400).json({

                    message:
                        "You can contact only a mentor whose request has been accepted"

                });

            }


            // Check whether conversation already exists

            let conversation =
                await Conversation.findOne({

                    mentor: mentorId,

                    student: req.user.id

                });


            // Create if it doesn't exist

            if (!conversation) {

                conversation =
                    await Conversation.create({

                        mentor: mentorId,

                        student: req.user.id

                    });

            }


            return res.status(200).json({

                message:
                    "Conversation opened successfully",

                conversation

            });

        }


        // =====================================================
        // MENTOR → STUDENT
        // =====================================================

        if (studentId) {

            console.log(
                "Mentor is contacting student:",
                studentId
            );


            // Check student exists

            const student =
                await User.findById(studentId);

            if (!student) {

                return res.status(404).json({

                    message:
                        "Student not found"

                });

            }


            console.log(
                "Student found:",
                student._id
            );


            // Check accepted mentorship request

            const acceptedRequest =
                await MentorRequest.findOne({

                    student: studentId,

                    mentor: {
                        $in: await Mentor.find({
                            user: req.user.id
                        }).distinct("_id")
                    },

                    status: "Accepted"

                });


            console.log(
                "Accepted student request:",
                acceptedRequest
            );


            if (!acceptedRequest) {

                return res.status(400).json({

                    message:
                        "You can contact only a student whose mentorship request has been accepted"

                });

            }


            // Get mentor profile of logged-in mentor

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


            // Check existing conversation

            let conversation =
                await Conversation.findOne({

                    mentor: mentor._id,

                    student: studentId

                });


            // Create conversation

            if (!conversation) {

                conversation =
                    await Conversation.create({

                        mentor: mentor._id,

                        student: studentId

                    });

            }


            return res.status(200).json({

                message:
                    "Conversation opened successfully",

                conversation

            });

        }


        // =====================================================
        // NO ID PROVIDED
        // =====================================================

        return res.status(400).json({

            message:
                "Mentor ID or Student ID is required"

        });


    } catch (error) {

        console.log(
            "Create Conversation Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create conversation",

            error:
                error.message

        });

    }

};

// ======================================
// GET MY CONVERSATIONS
// ======================================

// ======================================
// GET MY CONVERSATIONS
// STUDENT + MENTOR
// ======================================

const getMyConversations = async (req, res) => {

    try {

        // Check if logged-in user is a mentor

        const mentor = await Mentor.findOne({
            user: req.user.id
        });


        let conversations;


        // ======================================
        // MENTOR
        // ======================================

        if (mentor) {

            conversations =
                await Conversation.find({

                    mentor: mentor._id

                })
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "mentor",
                    "name email expertise"
                )
                .sort({
                    updatedAt: -1
                });

        }


        // ======================================
        // STUDENT
        // ======================================

        else {

            conversations =
                await Conversation.find({

                    student: req.user.id

                })
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "mentor",
                    "name email expertise"
                )
                .sort({
                    updatedAt: -1
                });

        }


        res.status(200).json({

            message:
                "Conversations fetched successfully",

            conversations

        });

    } catch (error) {

        console.log(
            "Get Conversations Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch conversations",

            error: error.message

        });

    }

};


// ======================================
// GET CONVERSATION MESSAGES
// ======================================

const getMessages = async (req, res) => {

    try {

        const { conversationId } =
            req.params;


        const conversation =
            await Conversation.findById(
                conversationId
            );


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        // Check whether user belongs
        // to this conversation

        const mentor =
            await Mentor.findOne({
                user: req.user.id
            });


        const isStudent =
            conversation.student.toString() ===
            req.user.id.toString();


        const isMentor =
            mentor &&
            conversation.mentor.toString() ===
            mentor._id.toString();


        if (!isStudent && !isMentor) {

            return res.status(403).json({

                message:
                    "You are not part of this conversation"

            });

        }


        const messages =
            await Message.find({

                conversation: conversationId

            })
            .populate(
                "sender",
                "name email"
            )
            .sort({
                createdAt: 1
            });


        res.status(200).json({

            message:
                "Messages fetched successfully",

            messages

        });

    } catch (error) {

        console.log(
            "Get Messages Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch messages",

            error: error.message

        });

    }

};


// ======================================
// SEND MESSAGE
// ======================================

const sendMessage = async (req, res) => {

    try {

        const {
            conversationId,
            message
        } = req.body;


        if (!conversationId || !message) {

            return res.status(400).json({

                message:
                    "Conversation and message are required"

            });

        }


        const conversation =
            await Conversation.findById(
                conversationId
            );


        if (!conversation) {

            return res.status(404).json({

                message:
                    "Conversation not found"

            });

        }


        // Check mentor

        const mentor =
            await Mentor.findOne({

                user: req.user.id

            });


        const isStudent =
            conversation.student.toString() ===
            req.user.id.toString();


        const isMentor =
            mentor &&
            conversation.mentor.toString() ===
            mentor._id.toString();


        if (!isStudent && !isMentor) {

            return res.status(403).json({

                message:
                    "You are not part of this conversation"

            });

        }


        const senderRole =
            isMentor
                ? "mentor"
                : "student";


        const newMessage =
            await Message.create({

                conversation:
                    conversationId,

                sender:
                    req.user.id,

                senderRole,

                message:
                    message.trim()

            });


        // Update conversation

        conversation.lastMessage =
            message.trim();

        conversation.lastMessageAt =
            new Date();

        await conversation.save();


        const populatedMessage =
            await Message.findById(
                newMessage._id
            )
            .populate(
                "sender",
                "name email"
            );


        res.status(201).json({

            message:
                "Message sent successfully",

            newMessage:
                populatedMessage

        });

    } catch (error) {

        console.log(
            "Send Message Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to send message",

            error: error.message

        });

    }

};


module.exports = {

    createConversation,

    getMyConversations,

    getMessages,

    sendMessage

};