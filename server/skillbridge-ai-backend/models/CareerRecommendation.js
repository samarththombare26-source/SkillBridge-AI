const mongoose = require("mongoose");

const careerRecommendationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        interests: {
            type: [String],
            required: true
        },

        education: {
            type: String,
            required: true
        },

        experience: {
            type: String,
            default: ""
        },

        careerGoal: {
            type: String,
            default: ""
        },

        recommendations: {
            type: [String],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CareerRecommendation",
    careerRecommendationSchema
);