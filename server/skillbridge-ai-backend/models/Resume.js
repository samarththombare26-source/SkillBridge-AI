const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        personalInfo: {
            fullName: {
                type: String,
                default: ""
            },

            email: {
                type: String,
                default: ""
            },

            phone: {
                type: String,
                default: ""
            },

            address: {
                type: String,
                default: ""
            },

            linkedin: {
                type: String,
                default: ""
            },

            github: {
                type: String,
                default: ""
            }
        },

        careerObjective: {
            type: String,
            default: ""
        },

        education: [
            {
                degree: {
                    type: String,
                    default: ""
                },

                institute: {
                    type: String,
                    default: ""
                },

                year: {
                    type: String,
                    default: ""
                },

                percentage: {
                    type: String,
                    default: ""
                }
            }
        ],

        skills: [
            {
                type: String
            }
        ],

        projects: [
            {
                title: {
                    type: String,
                    default: ""
                },

                description: {
                    type: String,
                    default: ""
                },

                technologies: {
                    type: String,
                    default: ""
                }
            }
        ],

        experience: [
            {
                company: {
                    type: String,
                    default: ""
                },

                role: {
                    type: String,
                    default: ""
                },

                duration: {
                    type: String,
                    default: ""
                },

                description: {
                    type: String,
                    default: ""
                }
            }
        ],

        certifications: [
            {
                name: {
                    type: String,
                    default: ""
                },

                organization: {
                    type: String,
                    default: ""
                },

                year: {
                    type: String,
                    default: ""
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Resume",
    resumeSchema
);