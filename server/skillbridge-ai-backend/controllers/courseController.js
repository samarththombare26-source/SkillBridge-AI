
const Course = require("../models/Course");


// ===============================
// GET ALL COURSES
// ===============================

const getCourses = async (req, res) => {

    try {

        const courses = await Course.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};


// ===============================
// CREATE COURSE
// ===============================

const createCourse = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            instructor,
            duration,
            level
        } = req.body;


        const course = await Course.create({
            title,
            description,
            category,
            instructor,
            duration,
            level
        });


        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to create course",
            error: error.message
        });

    }

};


// ===============================
// UPDATE COURSE
// ===============================

const updateCourse = async (req, res) => {

    try {

        const { courseId } = req.params;


        const course = await Course.findByIdAndUpdate(
            courseId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }


        res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update course",
            error: error.message
        });

    }

};


// ===============================
// DELETE COURSE
// ===============================

const deleteCourse = async (req, res) => {

    try {

        const { courseId } = req.params;


        const course = await Course.findByIdAndDelete(courseId);


        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }


        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete course",
            error: error.message
        });

    }

};


module.exports = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
};

