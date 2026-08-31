import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function CreateLesson() {

    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        course: "",
        title: "",
        description: "",
        content: "",
        order: "",
        duration: "",
        videoUrl: "",
        videoDuration: ""
    });

    const [videoError, setVideoError] = useState("");


    // Get all courses
    useEffect(() => {

        getCourses();

    }, []);


    const getCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(response.data.courses || []);

        } catch (error) {

            console.log(
                "Courses Error:",
                error.response?.data || error.message
            );

        }

    };


    // Handle form fields
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "videoDuration") {

            if (value && Number(value) > 40) {

                setVideoError("Video duration cannot exceed 40 minutes");

            } else {

                setVideoError("");

            }

        }

        if (name === "videoUrl") {

            setVideoError("");

        }

    };


    const getEmbedUrl = (url) => {

        if (!url) return "";

        // YouTube watch -> embed
        if (url.includes("youtube.com/watch")) {

            return url.replace("watch?v=", "embed/");

        }

        if (url.includes("youtu.be/")) {

            return url.replace("youtu.be/", "www.youtube.com/embed/");

        }

        return url;

    };


    // Create lesson
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            formData.videoDuration &&
            Number(formData.videoDuration) > 40
        ) {

            setVideoError("Video duration cannot exceed 40 minutes");
            return;

        }

        if (
            formData.videoUrl &&
            formData.videoUrl.trim() !== "" &&
            !/^https?:\/\//.test(formData.videoUrl)
        ) {

            setVideoError("Video URL must start with http:// or https://");
            return;

        }

        try {

            const payload = {
                ...formData,
                videoDuration: formData.videoDuration
                    ? Number(formData.videoDuration)
                    : 0
            };

            const response = await API.post(
                "/lessons",
                payload
            );

            alert(response.data.message);

            // Keep selected course,
            // reset the lesson fields
            setFormData({
                course: formData.course,
                title: "",
                description: "",
                content: "",
                order: "",
                duration: "",
                videoUrl: "",
                videoDuration: ""
            });

            setVideoError("");

        } catch (error) {

            console.log(
                "Lesson Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to create lesson"
            );

        }

    };


    return (

        <div className="container-fluid" style={{ maxWidth: "780px" }}>

            <div className="card shadow-sm border-0 rounded-4">

                <div className="card-body p-4 p-md-5">

                    <h3 className="fw-bold mb-1">
                        Create New Lesson
                    </h3>

                    <p className="text-muted small mb-4">
                        Attach a video (max 40 min) to make the lesson completable by watching.
                    </p>


                    <form onSubmit={handleSubmit}>


                        {/* Course */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Select Course <span className="text-danger">*</span>
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


                        {/* Title */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Lesson Title <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Example: Java Basics"
                                required
                            />

                        </div>


                        {/* Description */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Lesson Description <span className="text-danger">*</span>
                            </label>

                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter lesson description"
                                rows="3"
                                required
                            />

                        </div>


                        {/* Content */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Lesson Content <span className="text-danger">*</span>
                            </label>

                            <textarea
                                className="form-control"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Enter lesson content"
                                rows="5"
                                required
                            />

                        </div>


                        <div className="row g-3">


                            {/* Order */}

                            <div className="col-md-6">

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Lesson Order
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        placeholder="1"
                                        min="1"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Duration */}

                            <div className="col-md-6">

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="45 Minutes"
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Video Section */}

                        <div className="card bg-light border-0 rounded-3 p-3 mb-3">

                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-camera-video me-2"></i>
                                Lesson Video (optional, max 40 min)
                            </h6>

                            <div className="mb-3">

                                <label className="form-label small fw-semibold">
                                    Video URL
                                </label>

                                <input
                                    type="url"
                                    className="form-control"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                                />

                                <small className="text-muted">
                                    Paste YouTube link or direct MP4 URL. Leave empty for text-only lesson.
                                </small>

                            </div>

                            <div>

                                <label className="form-label small fw-semibold">
                                    Video Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="videoDuration"
                                    value={formData.videoDuration}
                                    onChange={handleChange}
                                    placeholder="e.g. 12"
                                    min="1"
                                    max="40"
                                />

                                <small className="text-muted">
                                    Max 40 minutes. Required if video URL is provided.
                                </small>

                            </div>

                            {videoError && (

                                <div className="alert alert-danger py-2 mt-3 mb-0 small">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    {videoError}
                                </div>

                            )}

                            {formData.videoUrl && !videoError && (

                                <div className="mt-3">

                                    <small className="fw-semibold">Preview:</small>

                                    <div className="ratio ratio-16x9 mt-2 rounded-3 overflow-hidden border">

                                        <iframe
                                            src={getEmbedUrl(formData.videoUrl)}
                                            title="Video preview"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>

                                    </div>

                                </div>

                            )}

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            Create Lesson
                        </button>


                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateLesson;
