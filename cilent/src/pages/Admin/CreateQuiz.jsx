import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function CreateQuiz() {

    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [formData, setFormData] = useState({
        course: "",
        lesson: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: ""
    });


    // ======================================
    // GET COURSES
    // ======================================

    useEffect(() => {

        getCourses();

    }, []);


    const getCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(
                response.data.courses || []
            );

        } catch (error) {

            console.log(
                "Courses Error:",
                error.response?.data || error.message
            );

        }

    };


    // ======================================
    // GET LESSONS OF COURSE
    // ======================================

    const getLessons = async (courseId) => {

        try {

            const response = await API.get(
                `/lessons/course/${courseId}`
            );

            setLessons(
                response.data.lessons || []
            );

        } catch (error) {

            console.log(
                "Lessons Error:",
                error.response?.data || error.message
            );

            setLessons([]);

        }

    };


    // ======================================
    // HANDLE CHANGE
    // ======================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "course") {

            setFormData({
                ...formData,
                course: value,
                lesson: ""
            });

            getLessons(value);
        }

    };


    // ======================================
    // HANDLE OPTION CHANGE
    // ======================================

    const handleOptionChange = (index, value) => {

        const updatedOptions = [
            ...formData.options
        ];

        updatedOptions[index] = value;

        setFormData({
            ...formData,
            options: updatedOptions
        });

    };


    // ======================================
    // CREATE QUIZ
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/quizzes",
                formData
            );

            alert(response.data.message);


            // Reset question
            setFormData({
                course: formData.course,
                lesson: formData.lesson,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: ""
            });

        } catch (error) {

            console.log(
                "Quiz Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to create quiz"
            );

        }

    };


    return (

        <div className="container py-4 py-md-5">

            <div className="card shadow">

                <div className="card-body p-3 p-md-4 p-lg-5">

                    <h2 className="mb-4">
                        Create Quiz
                    </h2>


                    <form onSubmit={handleSubmit}>


                        {/* COURSE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Select Course
                            </label>

                            <select
                                className="form-select"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Select Course --
                                </option>

                                {courses.map((course) => (

                                    <option
                                        key={course._id}
                                        value={course._id}
                                    >
                                        {course.title}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* LESSON */}

                        <div className="mb-3">

                            <label className="form-label">
                                Select Lesson
                            </label>

                            <select
                                className="form-select"
                                name="lesson"
                                value={formData.lesson}
                                onChange={handleChange}
                                required
                                disabled={!formData.course}
                            >

                                <option value="">
                                    -- Select Lesson --
                                </option>

                                {lessons.map((lesson) => (

                                    <option
                                        key={lesson._id}
                                        value={lesson._id}
                                    >
                                        {lesson.title}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* QUESTION */}

                        <div className="mb-3">

                            <label className="form-label">
                                Question
                            </label>

                            <textarea
                                className="form-control"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                placeholder="Enter quiz question"
                                rows="3"
                                required
                            />

                        </div>


                        {/* OPTIONS */}

                        <h5 className="mt-4">
                            Options
                        </h5>


                        {formData.options.map(
                            (option, index) => (

                                <div
                                    className="mb-3"
                                    key={index}
                                >

                                    <label className="form-label">
                                        Option {index + 1}
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Enter option ${
                                            index + 1
                                        }`}
                                        required
                                    />

                                </div>

                            )
                        )}


                        {/* CORRECT ANSWER */}

                        <div className="mb-4">

                            <label className="form-label">
                                Correct Answer
                            </label>

                            <select
                                className="form-select"
                                name="correctAnswer"
                                value={formData.correctAnswer}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Select Correct Answer --
                                </option>

                                {formData.options.map(
                                    (option, index) => (

                                        option && (

                                            <option
                                                key={index}
                                                value={option}
                                            >
                                                {option}
                                            </option>

                                        )

                                    )
                                )}

                            </select>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Create Quiz
                        </button>


                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateQuiz;