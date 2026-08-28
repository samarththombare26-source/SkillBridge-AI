const mongoose = require("mongoose");

const mentorRequestSchema = new mongoose.Schema(
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

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "MentorRequest",
    mentorRequestSchema
);