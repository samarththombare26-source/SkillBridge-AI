const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: [
                "mentor_request",
                "mentor_request_accepted",
                "mentor_request_rejected",
                "new_message",
                "system",
            ],
            default: "system",
        },

        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);