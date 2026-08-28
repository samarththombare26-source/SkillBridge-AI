const CareerRoadmap = require("../models/CareerRoadmap");

// ======================================
// CREATE CAREER ROADMAP
// ======================================

const createCareerRoadmap = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            skills,
            steps,
            resources,
            level
        } = req.body;


        if (
            !title ||
            !description ||
            !category ||
            !skills ||
            !steps
        ) {

            return res.status(400).json({
                message: "Title, description, category, skills and steps are required"
            });

        }


        const roadmap = await CareerRoadmap.create({

            title,
            description,
            category,
            skills,
            steps,
            resources,
            level

        });


        res.status(201).json({

            message: "Career roadmap created successfully",

            roadmap

        });


    } catch (error) {

        console.log(
            "Create Career Roadmap Error:",
            error
        );


        res.status(500).json({

            message: "Failed to create career roadmap",

            error: error.message

        });

    }

};


// ======================================
// GET ALL CAREER ROADMAPS
// ======================================

const getCareerRoadmaps = async (req, res) => {

    try {

        const roadmaps =
            await CareerRoadmap.find()
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            message:
                "Career roadmaps fetched successfully",

            roadmaps

        });


    } catch (error) {

        console.log(
            "Get Career Roadmaps Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch career roadmaps",

            error: error.message

        });

    }

};


// ======================================
// GET SINGLE CAREER ROADMAP
// ======================================

const getCareerRoadmapById = async (req, res) => {

    try {

        const {
            roadmapId
        } = req.params;


        const roadmap =
            await CareerRoadmap.findById(
                roadmapId
            );


        if (!roadmap) {

            return res.status(404).json({

                message:
                    "Career roadmap not found"

            });

        }


        res.status(200).json({

            message:
                "Career roadmap fetched successfully",

            roadmap

        });


    } catch (error) {

        console.log(
            "Get Career Roadmap Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch career roadmap",

            error: error.message

        });

    }

};


// ======================================
// UPDATE CAREER ROADMAP
// ======================================

const updateCareerRoadmap = async (req, res) => {

    try {

        const {
            roadmapId
        } = req.params;


        const roadmap =
            await CareerRoadmap.findByIdAndUpdate(

                roadmapId,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!roadmap) {

            return res.status(404).json({

                message:
                    "Career roadmap not found"

            });

        }


        res.status(200).json({

            message:
                "Career roadmap updated successfully",

            roadmap

        });

    } catch (error) {

        console.log(
            "Update Career Roadmap Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update career roadmap",

            error: error.message

        });

    }

};


// ======================================
// DELETE CAREER ROADMAP
// ======================================

const deleteCareerRoadmap = async (req, res) => {

    try {

        const {
            roadmapId
        } = req.params;


        const roadmap =
            await CareerRoadmap.findByIdAndDelete(
                roadmapId
            );


        if (!roadmap) {

            return res.status(404).json({

                message:
                    "Career roadmap not found"

            });

        }


        res.status(200).json({

            message:
                "Career roadmap deleted successfully"

        });

    } catch (error) {

        console.log(
            "Delete Career Roadmap Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete career roadmap",

            error: error.message

        });

    }

};


module.exports = {

    createCareerRoadmap,

    getCareerRoadmaps,

    getCareerRoadmapById,

    updateCareerRoadmap,

    deleteCareerRoadmap

};