const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Mentor = require("../models/Mentor");

// ======================================
// SEND MESSAGE
// ======================================

const sendMessage = async (req, res) => {

    try {

        const {
            conversationId,
            message
        } = req.body;


        // ----------------------------------
        // VALIDATION
        // ----------------------------------

        if (!conversationId || !message) {

            return res.status(400).json({

                message:
                    "Conversation ID and message are required"

            });

        }


        // ----------------------------------
        // CHECK CONVERSATION
        // ----------------------------------

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


        // ----------------------------------
        // FIND USER ROLE
        // ----------------------------------

        let senderRole = "student";


        const mentor =
            await Mentor.findOne({
                user: req.user.id
            });


        if (mentor) {

            senderRole = "mentor";

        }


        // ----------------------------------
        // CHECK USER BELONGS TO CONVERSATION
        // ----------------------------------

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


        // ----------------------------------
        // CREATE MESSAGE
        // ----------------------------------

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


        // ----------------------------------
        // POPULATE SENDER
        // ----------------------------------

        await newMessage.populate(
            "sender",
            "name email"
        );


        // ==================================
        // SOCKET.IO REAL-TIME MESSAGE
        // ==================================

        const io = req.app.get("io");


        if (io) {

            io.to(
                `conversation_${conversationId}`
            ).emit(
                "newMessage",
                newMessage
            );

        }


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        res.status(201).json({

            message:
                "Message sent successfully",

            newMessage

        });


    } catch (error) {

        console.log(
            "Send Message Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to send message",

            error:
                error.message

        });

    }

};


// ======================================
// GET CONVERSATION MESSAGES
// ======================================

const getMessages = async (req, res) => {

    try {

        const {
            conversationId
        } = req.params;


        // ----------------------------------
        // CHECK CONVERSATION
        // ----------------------------------

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


        // ----------------------------------
        // FIND MENTOR PROFILE
        // ----------------------------------

        const mentor =
            await Mentor.findOne({

                user:
                    req.user.id

            });


        // ----------------------------------
        // CHECK ACCESS
        // ----------------------------------

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


        // ----------------------------------
        // GET MESSAGES
        // ----------------------------------

        const messages =
            await Message.find({

                conversation:
                    conversationId

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

            error:
                error.message

        });

    }

};


module.exports = {

    sendMessage,
    getMessages

};