const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        expertise: {
            type: String,
            required: true,
            trim: true
        },

        experience: {
            type: String,
            required: true,
            trim: true
        },

        bio: {
            type: String,
            required: true,
            trim: true
        },

        linkedin: {
            type: String,
            trim: true
        },

        availability: {
            type: String,
            enum: [
                "Available",
                "Busy",
                "Not Available"
            ],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Mentor",
    mentorSchema
);