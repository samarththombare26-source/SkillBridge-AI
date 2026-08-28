const Resume = require("../models/Resume");

// ======================================
// CREATE / UPDATE RESUME
// ======================================

const saveResume = async (req, res) => {
    try {

        const studentId = req.user.id;

        const {
            personalInfo,
            careerObjective,
            education,
            skills,
            projects,
            experience,
            certifications
        } = req.body;


        const resume = await Resume.findOneAndUpdate(
            {
                student: studentId
            },
            {
                student: studentId,
                personalInfo,
                careerObjective,
                education,
                skills,
                projects,
                experience,
                certifications
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );


        res.status(200).json({
            message: "Resume saved successfully",
            resume
        });

    } catch (error) {

        console.log(
            "Save Resume Error:",
            error
        );

        res.status(500).json({
            message: "Failed to save resume",
            error: error.message
        });
    }
};


// ======================================
// GET MY RESUME
// ======================================

const getMyResume = async (req, res) => {
    try {

        const studentId = req.user.id;

        const resume = await Resume.findOne({
            student: studentId
        });


        if (!resume) {

            return res.status(404).json({
                message: "Resume not found"
            });

        }


        res.status(200).json({
            message: "Resume fetched successfully",
            resume
        });

    } catch (error) {

        console.log(
            "Get Resume Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};


// ======================================
// DELETE MY RESUME
// ======================================

const deleteResume = async (req, res) => {
    try {

        const studentId = req.user.id;

        const resume = await Resume.findOneAndDelete({
            student: studentId
        });


        if (!resume) {

            return res.status(404).json({
                message: "Resume not found"
            });

        }


        res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {

        console.log(
            "Delete Resume Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};


module.exports = {
    saveResume,
    getMyResume,
    deleteResume
};