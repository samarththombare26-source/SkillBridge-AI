const mongoose = require("mongoose");

const careerRoadmapSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            required: true
        },

        steps: [
            {
                title: {
                    type: String,
                    required: true
                },

                description: {
                    type: String,
                    required: true
                },

                duration: {
                    type: String,
                    required: true
                }
            }
        ],

        resources: {
            type: [String],
            default: []
        },

        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CareerRoadmap",
    careerRoadmapSchema
);