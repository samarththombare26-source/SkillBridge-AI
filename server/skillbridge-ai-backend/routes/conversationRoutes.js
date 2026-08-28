const express = require("express");

const router = express.Router();

const {

    createConversation,

    getMyConversations,

    getMessages,

    sendMessage

} = require("../controllers/conversationController");

const verifyToken =
    require("../middleware/authMiddleware");


// ======================================
// CREATE / GET CONVERSATION
// ======================================

router.post(
    "/",
    verifyToken,
    createConversation
);


// ======================================
// GET MY CONVERSATIONS
// ======================================

router.get(
    "/",
    verifyToken,
    getMyConversations
);


// ======================================
// GET MESSAGES
// ======================================

router.get(
    "/:conversationId/messages",
    verifyToken,
    getMessages
);


// ======================================
// SEND MESSAGE
// ======================================

router.post(
    "/message",
    verifyToken,
    sendMessage
);


module.exports = router;