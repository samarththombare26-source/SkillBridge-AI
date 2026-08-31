
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function ManageLessons() {

    const [lessons, setLessons] = useState([]);

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingLesson, setEditingLesson] = useState(null);


    // ==================================
    // LOAD COURSES + LESSONS
    // ==================================

    useEffect(() => {

        getCourses();
        getLessons();

    }, []);


    // ==================================
    // GET COURSES
    // ==================================

    const getCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(
                response.data.courses || []
            );

        } catch (error) {

            console.log(error);

        }

    };


    // ==================================
    // GET ALL LESSONS
    // ==================================

    const getLessons = async () => {

        try {

            const response = await API.get("/lessons");

            setLessons(
                response.data.lessons || []
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };


    // ==================================
    // DELETE LESSON
    // ==================================

    const handleDelete = async (lessonId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this lesson?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await API.delete(
                `/lessons/${lessonId}`
            );


            alert(response.data.message);


            setLessons(
                lessons.filter(
                    (lesson) =>
                        lesson._id !== lessonId
                )
            );


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete lesson"
            );

        }

    };


    // ==================================
    // START EDIT
    // ==================================

    const handleEdit = (lesson) => {

        setEditingLesson({
            ...lesson,
            course: lesson.course?._id || lesson.course
        });

    };


    // ==================================
    // UPDATE LESSON
    // ==================================

    const handleUpdate = async (e) => {

        e.preventDefault();


        try {

            const response = await API.put(
                `/lessons/${editingLesson._id}`,
                editingLesson
            );


            alert(response.data.message);


            await getLessons();


            setEditingLesson(null);


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update lesson"
            );

        }

    };


    return (

        <div className="container py-4 py-md-5">


            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <h2>
                    Manage Lessons
                </h2>


                <a
                    href="/admin/create-lesson"
                    className="btn btn-success"
                >
                    + Create Lesson
                </a>

            </div>


            {/* EDIT FORM */}

            {editingLesson && (

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <h4 className="mb-4">
                            Edit Lesson
                        </h4>


                        <form onSubmit={handleUpdate}>


                            {/* Course */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Course
                                </label>

                                <select
                                    className="form-select"
                                    value={editingLesson.course}
                                    onChange={(e) =>
                                        setEditingLesson({
                                            ...editingLesson,
                                            course: e.target.value
                                        })
                                    }
                                    required
                                >

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


                            {/* Title */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Lesson Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingLesson.title}
                                    onChange={(e) =>
                                        setEditingLesson({
                                            ...editingLesson,
                                            title: e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            {/* Description */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={
                                        editingLesson.description
                                    }
                                    onChange={(e) =>
                                        setEditingLesson({
                                            ...editingLesson,
                                            description:
                                                e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            {/* Content */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Content
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="6"
                                    value={editingLesson.content}
                                    onChange={(e) =>
                                        setEditingLesson({
                                            ...editingLesson,
                                            content:
                                                e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="row g-3">


                                {/* Order */}

                                <div className="col-md-6">

                                    <label className="form-label">
                                        Order
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        value={editingLesson.order}
                                        onChange={(e) =>
                                            setEditingLesson({
                                                ...editingLesson,
                                                order:
                                                    e.target.value
                                            })
                                        }
                                        min="1"
                                        required
                                    />

                                </div>


                                {/* Duration */}

                                <div className="col-md-6">

                                    <label className="form-label">
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            editingLesson.duration
                                        }
                                        onChange={(e) =>
                                            setEditingLesson({
                                                ...editingLesson,
                                                duration:
                                                    e.target.value
                                            })
                                        }
                                    />

                                </div>

                            </div>

                            {/* Video URL */}

                            <div className="card bg-light border-0 rounded-3 p-3 mt-3">

                                <h6 className="fw-bold mb-2">
                                    <i className="bi bi-camera-video me-2"></i>
                                    Lesson Video (max 40 min)
                                </h6>

                                <div className="mb-2">

                                    <label className="form-label small fw-semibold">
                                        Video URL
                                    </label>

                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                                        value={editingLesson.videoUrl || ""}
                                        onChange={(e) =>
                                            setEditingLesson({
                                                ...editingLesson,
                                                videoUrl: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div>

                                    <label className="form-label small fw-semibold">
                                        Video Duration (minutes, max 40)
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 12"
                                        value={editingLesson.videoDuration || ""}
                                        onChange={(e) => {

                                            const val = e.target.value;

                                            if (val && Number(val) > 40) {
                                                alert("Video duration cannot exceed 40 minutes");
                                                return;
                                            }

                                            setEditingLesson({
                                                ...editingLesson,
                                                videoDuration: val
                                            });

                                        }}
                                        min="1"
                                        max="40"
                                    />

                                </div>

                            </div>


                            <div className="mt-4">

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
                                        setEditingLesson(null)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}


            {/* LESSON LIST */}

            {loading ? (

                <p>
                    Loading lessons...
                </p>

            ) : lessons.length === 0 ? (

                <div className="alert alert-info">
                    No lessons available.
                </div>

            ) : (

                <div className="row g-4">

                    {lessons.map((lesson) => (

                        <div
                            className="col-12 col-sm-6 col-lg-4"
                            key={lesson._id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body">


                                    <span className="badge bg-primary mb-2">

                                        {lesson.course?.title ||
                                            "Unknown Course"}

                                    </span>


                                    <h5>
                                        {lesson.title}
                                    </h5>


                                    <p>
                                        {lesson.description}
                                    </p>


                                    <hr />


                                    <p className="mb-1">

                                        <strong>
                                            Lesson:
                                        </strong>{" "}

                                        {lesson.order}

                                    </p>


                                    <p className="mb-2">

                                        <strong>
                                            Duration:
                                        </strong>{" "}

                                        {lesson.duration ||
                                            "Not specified"}

                                    </p>

                                    {lesson.videoUrl ? (

                                        <p className="mb-3">

                                            <span className="badge bg-success">
                                                <i className="bi bi-camera-video me-1"></i>
                                                Video: {lesson.videoDuration || "?"} min
                                            </span>

                                            <small className="text-muted ms-2 text-truncate d-inline-block" style={{ maxWidth: "180px", verticalAlign: "middle" }}>
                                                {lesson.videoUrl}
                                            </small>

                                        </p>

                                    ) : (

                                        <p className="mb-3">

                                            <span className="badge bg-warning text-dark">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                No video
                                            </span>

                                        </p>

                                    )}


                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() =>
                                            handleEdit(lesson)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(
                                                lesson._id
                                            )
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

export default ManageLessons;

