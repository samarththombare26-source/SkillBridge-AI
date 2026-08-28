const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },

        question: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 2;
                },
                message: "At least 2 options are required"
            }
        },

        correctAnswer: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Quiz", quizSchema);