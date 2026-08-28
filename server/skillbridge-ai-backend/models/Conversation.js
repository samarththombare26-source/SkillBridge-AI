const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor",
            required: true
        },

        lastMessage: {
            type: String,
            default: ""
        },

        lastMessageAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


// Prevent duplicate student-mentor conversations

conversationSchema.index(
    {
        student: 1,
        mentor: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);