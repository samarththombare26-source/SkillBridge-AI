const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        location: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        stipend: {
            type: String,
            default: "Unpaid"
        },

        type: {
            type: String,
            enum: [
                "Internship",
                "Part Time",
                "Full Time"
            ],
            default: "Internship"
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Open",
                "Closed"
            ],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Internship",
    internshipSchema
);