
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function ManageCourses() {

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingCourse, setEditingCourse] = useState(null);


    // =========================
    // GET COURSES
    // =========================

    useEffect(() => {

        getCourses();

    }, []);


    const getCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(response.data.courses || []);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DELETE COURSE
    // =========================

    const handleDelete = async (courseId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await API.delete(
                `/courses/${courseId}`
            );


            alert(response.data.message);


            // Remove deleted course from screen
            setCourses(
                courses.filter(
                    (course) => course._id !== courseId
                )
            );


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete course"
            );

        }

    };


    // =========================
    // EDIT COURSE
    // =========================

    const handleEdit = (course) => {

        setEditingCourse({
            ...course
        });

    };


    // =========================
    // UPDATE COURSE
    // =========================

    const handleUpdate = async (e) => {

        e.preventDefault();


        try {

            const response = await API.put(
                `/courses/${editingCourse._id}`,
                editingCourse
            );


            alert(response.data.message);


            // Update course on screen
            setCourses(
                courses.map((course) =>
                    course._id === editingCourse._id
                        ? response.data.course
                        : course
                )
            );


            setEditingCourse(null);


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update course"
            );

        }

    };


    return (

        <div className="container mt-5">


            {/* =========================
                HEADER
            ========================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Manage Courses
                </h2>


                <a
                    href="/admin/create-course"
                    className="btn btn-primary"
                >
                    + Create Course
                </a>

            </div>


            {/* =========================
                EDIT FORM
            ========================= */}

            {editingCourse && (

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <h4 className="mb-4">
                            Edit Course
                        </h4>


                        <form onSubmit={handleUpdate}>


                            <div className="mb-3">

                                <label className="form-label">
                                    Course Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingCourse.title}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            title: e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={editingCourse.description}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            description:
                                                e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingCourse.category}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            category:
                                                e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">
                                    Instructor
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingCourse.instructor}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            instructor:
                                                e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="row">


                                <div className="col-md-6">

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Duration
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingCourse.duration}
                                            onChange={(e) =>
                                                setEditingCourse({
                                                    ...editingCourse,
                                                    duration:
                                                        e.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="col-md-6">

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Level
                                        </label>

                                        <select
                                            className="form-select"
                                            value={editingCourse.level}
                                            onChange={(e) =>
                                                setEditingCourse({
                                                    ...editingCourse,
                                                    level:
                                                        e.target.value
                                                })
                                            }
                                            required
                                        >

                                            <option value="Beginner">
                                                Beginner
                                            </option>

                                            <option value="Intermediate">
                                                Intermediate
                                            </option>

                                            <option value="Advanced">
                                                Advanced
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="btn btn-success me-2"
                            >
                                Save Changes
                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setEditingCourse(null)
                                }
                            >
                                Cancel
                            </button>


                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                COURSES
            ========================= */}

            {loading ? (

                <p>
                    Loading courses...
                </p>

            ) : courses.length === 0 ? (

                <div className="alert alert-info">
                    No courses available.
                </div>

            ) : (

                <div className="row">

                    {courses.map((course) => (

                        <div
                            className="col-md-4 mb-4"
                            key={course._id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body">


                                    <h5 className="card-title">
                                        {course.title}
                                    </h5>


                                    <p className="card-text">
                                        {course.description}
                                    </p>


                                    <hr />


                                    <p className="mb-1">

                                        <strong>
                                            Category:
                                        </strong>{" "}

                                        {course.category}

                                    </p>


                                    <p className="mb-1">

                                        <strong>
                                            Instructor:
                                        </strong>{" "}

                                        {course.instructor}

                                    </p>


                                    <p className="mb-1">

                                        <strong>
                                            Duration:
                                        </strong>{" "}

                                        {course.duration}

                                    </p>


                                    <p>

                                        <strong>
                                            Level:
                                        </strong>{" "}

                                        {course.level}

                                    </p>


                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() =>
                                            handleEdit(course)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(course._id)
                                        }
                                    >
                                        Delete
                                    </button>


                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default ManageCourses;

