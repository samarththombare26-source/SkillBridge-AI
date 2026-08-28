const Internship = require("../models/Internship");

// ======================================
// CREATE INTERNSHIP
// ======================================

const createInternship = async (req, res) => {

    try {

        const {
            title,
            company,
            description,
            skills,
            location,
            duration,
            stipend,
            type,
            deadline
        } = req.body;


        if (
            !title ||
            !company ||
            !description ||
            !skills ||
            !location ||
            !duration ||
            !deadline
        ) {

            return res.status(400).json({
                message: "Title, company, description, skills, location, duration and deadline are required"
            });

        }


        const internship = await Internship.create({
            title,
            company,
            description,
            skills,
            location,
            duration,
            stipend,
            type,
            deadline
        });


        res.status(201).json({
            message: "Internship created successfully",
            internship
        });


    } catch (error) {

        console.log(
            "Create Internship Error:",
            error
        );

        res.status(500).json({
            message: "Failed to create internship",
            error: error.message
        });

    }

};


// ======================================
// GET ALL INTERNSHIPS
// ======================================

const getAllInternships = async (req, res) => {

    try {

        const internships = await Internship.find()
            .sort({
                createdAt: -1
            });


        res.status(200).json({
            message: "Internships fetched successfully",
            internships
        });


    } catch (error) {

        console.log(
            "Get Internships Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch internships",
            error: error.message
        });

    }

};


// ======================================
// GET SINGLE INTERNSHIP
// ======================================

const getInternshipById = async (req, res) => {

    try {

        const {
            internshipId
        } = req.params;


        const internship =
            await Internship.findById(
                internshipId
            );


        if (!internship) {

            return res.status(404).json({
                message: "Internship not found"
            });

        }


        res.status(200).json({
            message: "Internship fetched successfully",
            internship
        });


    } catch (error) {

        console.log(
            "Get Internship Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch internship",
            error: error.message
        });

    }

};


// ======================================
// UPDATE INTERNSHIP
// ======================================

const updateInternship = async (req, res) => {

    try {

        const {
            internshipId
        } = req.params;


        const internship =
            await Internship.findByIdAndUpdate(
                internshipId,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!internship) {

            return res.status(404).json({
                message: "Internship not found"
            });

        }


        res.status(200).json({
            message: "Internship updated successfully",
            internship
        });


    } catch (error) {

        console.log(
            "Update Internship Error:",
            error
        );

        res.status(500).json({
            message: "Failed to update internship",
            error: error.message
        });

    }

};


// ======================================
// DELETE INTERNSHIP
// ======================================

const deleteInternship = async (req, res) => {

    try {

        const {
            internshipId
        } = req.params;


        const internship =
            await Internship.findByIdAndDelete(
                internshipId
            );


        if (!internship) {

            return res.status(404).json({
                message: "Internship not found"
            });

        }


        res.status(200).json({
            message: "Internship deleted successfully"
        });


    } catch (error) {

        console.log(
            "Delete Internship Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete internship",
            error: error.message
        });

    }

};


module.exports = {
    createInternship,
    getAllInternships,
    getInternshipById,
    updateInternship,
    deleteInternship
};