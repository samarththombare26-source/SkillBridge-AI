
const Lesson = require("../models/Lesson");


// ======================================
// CREATE LESSON
// ======================================

const createLesson = async (req, res) => {

    try {

        const {
            course,
            title,
            description,
            content,
            order,
            duration,
            videoUrl,
            videoDuration
        } = req.body;


        // Video duration validation - max 40 min
        if (videoDuration && Number(videoDuration) > 40) {

            return res.status(400).json({
                message: "Video duration cannot exceed 40 minutes"
            });

        }

        if (videoUrl && videoUrl.trim() !== "") {

            const isValidUrl =
                /^(https?:\/\/)/.test(videoUrl);

            if (!isValidUrl) {

                return res.status(400).json({
                    message: "Video URL must be a valid http(s) link"
                });

            }

        }

        if (!course || !title || !description || !content) {

            return res.status(400).json({
                message: "Course, title, description and content are required"
            });

        }


        const lesson = await Lesson.create({
            course,
            title,
            description,
            content,
            order,
            duration,
            videoUrl: videoUrl || "",
            videoDuration: videoDuration ? Number(videoDuration) : 0
        });


        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to create lesson",
            error: error.message
        });

    }

};


// ======================================
// GET LESSONS OF A COURSE
// ======================================

const getLessonsByCourse = async (req, res) => {

    try {

        const { courseId } = req.params;


        const lessons = await Lesson.find({
            course: courseId
        }).sort({
            order: 1
        });


        res.status(200).json({
            message: "Lessons fetched successfully",
            lessons
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch lessons",
            error: error.message
        });

    }

};


// ======================================
// GET ALL LESSONS
// ======================================

const getAllLessons = async (req, res) => {

    try {

        const lessons = await Lesson.find()
            .populate("course")
            .sort({
                course: 1,
                order: 1
            });


        res.status(200).json({
            message: "All lessons fetched successfully",
            lessons
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch lessons",
            error: error.message
        });

    }

};


// ======================================
// UPDATE LESSON
// ======================================

const updateLesson = async (req, res) => {

    try {

        const { lessonId } = req.params;

        if (
            req.body.videoDuration &&
            Number(req.body.videoDuration) > 40
        ) {

            return res.status(400).json({
                message: "Video duration cannot exceed 40 minutes"
            });

        }

        if (
            req.body.videoUrl &&
            req.body.videoUrl.trim() !== "" &&
            !/^(https?:\/\/)/.test(req.body.videoUrl)
        ) {

            return res.status(400).json({
                message: "Video URL must be a valid http(s) link"
            });

        }


        const lesson = await Lesson.findByIdAndUpdate(
            lessonId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!lesson) {

            return res.status(404).json({
                message: "Lesson not found"
            });

        }


        res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update lesson",
            error: error.message
        });

    }

};


// ======================================
// DELETE LESSON
// ======================================

const deleteLesson = async (req, res) => {

    try {

        const { lessonId } = req.params;


        const lesson = await Lesson.findByIdAndDelete(
            lessonId
        );


        if (!lesson) {

            return res.status(404).json({
                message: "Lesson not found"
            });

        }


        res.status(200).json({
            message: "Lesson deleted successfully"
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete lesson",
            error: error.message
        });

    }

};


module.exports = {
    createLesson,
    getLessonsByCourse,
    getAllLessons,
    updateLesson,
    deleteLesson
};

