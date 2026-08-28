const mongoose = require("mongoose");

const internshipApplicationSchema = new mongoose.Schema(
    {
        internship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Internship",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: String,
            default: ""
        },

        coverLetter: {
            type: String,
            default: ""
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


// Prevent same student from applying twice
internshipApplicationSchema.index(
    {
        internship: 1,
        student: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "InternshipApplication",
    internshipApplicationSchema
);