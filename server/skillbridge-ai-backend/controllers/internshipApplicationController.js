const InternshipApplication = require(
    "../models/InternshipApplication"
);


// ======================================
// APPLY FOR INTERNSHIP
// ======================================

const applyForInternship = async (req, res) => {

    try {

        const {
            internshipId,
            coverLetter
        } = req.body;


        const studentId = req.user.id;


        if (!internshipId) {

            return res.status(400).json({
                message: "Internship ID is required"
            });

        }


        // Check if already applied

        const existingApplication =
            await InternshipApplication.findOne({
                internship: internshipId,
                student: studentId
            });


        if (existingApplication) {

            return res.status(400).json({
                message:
                    "You have already applied for this internship"
            });

        }


        const application =
            await InternshipApplication.create({

                internship: internshipId,

                student: studentId,

                coverLetter: coverLetter || "",

                status: "Pending"

            });


        res.status(201).json({

            message:
                "Internship application submitted successfully",

            application

        });


    } catch (error) {

        console.log(
            "Apply Internship Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to apply for internship",

            error: error.message

        });

    }

};


// ======================================
// GET MY APPLICATIONS
// ======================================

const getMyApplications = async (req, res) => {

    try {

        const studentId = req.user.id;


        const applications =
            await InternshipApplication.find({
                student: studentId
            })
            .populate("internship")
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            message:
                "Applications fetched successfully",

            applications

        });


    } catch (error) {

        console.log(
            "Get Applications Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch applications",

            error: error.message

        });

    }

};


// ======================================
// GET ALL APPLICATIONS - ADMIN
// ======================================

const getAllApplications = async (req, res) => {

    try {

        const applications =
            await InternshipApplication.find()
            .populate("student", "name email")
            .populate("internship")
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            message:
                "Applications fetched successfully",

            applications

        });


    } catch (error) {

        console.log(
            "Get All Applications Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch applications",

            error: error.message

        });

    }

};


// ======================================
// UPDATE APPLICATION STATUS
// ======================================

const updateApplicationStatus = async (req, res) => {

    try {

        const {
            applicationId
        } = req.params;


        const {
            status
        } = req.body;


        if (
            ![
                "Pending",
                "Accepted",
                "Rejected"
            ].includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid application status"

            });

        }


        const application =
            await InternshipApplication.findByIdAndUpdate(

                applicationId,

                {
                    status: status
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!application) {

            return res.status(404).json({

                message:
                    "Application not found"

            });

        }


        res.status(200).json({

            message:
                "Application status updated",

            application

        });


    } catch (error) {

        console.log(
            "Update Application Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update application",

            error: error.message

        });

    }

};


module.exports = {

    applyForInternship,

    getMyApplications,

    getAllApplications,

    updateApplicationStatus

};