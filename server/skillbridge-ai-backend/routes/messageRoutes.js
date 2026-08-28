const express = require("express");

const router = express.Router();

const {
    sendMessage,
    getMessages
} = require("../controllers/messageController");

const verifyToken =
    require("../middleware/authMiddleware");


// ======================================
// SEND MESSAGE
// ======================================

router.post(
    "/",
    verifyToken,
    sendMessage
);


// ======================================
// GET CONVERSATION MESSAGES
// ======================================

router.get(
    "/:conversationId",
    verifyToken,
    getMessages
);


module.exports = router;