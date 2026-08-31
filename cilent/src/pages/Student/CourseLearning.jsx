import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";

function CourseLearning() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState({
        percentage: 0,
        completedLessons: [],
        completed: false
    });

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [videoWatched, setVideoWatched] = useState(false);
    const [watchConfirmed, setWatchConfirmed] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {

        getLessons();
        getProgress();

    }, [courseId]);

    useEffect(() => {

        setVideoWatched(false);
        setWatchConfirmed(false);

    }, [selectedLesson?._id]);


    // Get lessons
    const getLessons = async () => {

        try {

            const response = await API.get(
                `/lessons/course/${courseId}`
            );

            setLessons(response.data.lessons);

            if (response.data.lessons.length > 0) {
                setSelectedLesson(response.data.lessons[0]);
            }

        } catch (error) {

            console.log(error);

        }

    };


    // Get progress
    const getProgress = async () => {

        try {

            const response = await API.get(
                `/progress/${courseId}`
            );

            setProgress(response.data.progress);

        } catch (error) {

            console.log(error);

        }

    };


    // Complete lesson
    const completeLesson = async (lessonId) => {

        try {

            const response = await API.post(
                "/progress/complete",
                {
                    lessonId: lessonId
                }
            );

            setProgress(response.data.progress);

            alert("Lesson completed successfully!");

        }

        catch (error) {

            console.log("COMPLETE LESSON ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to update progress"
            );

        }

    };


    // Check lesson completion
    const isLessonCompleted = (lessonId) => {

        return progress.completedLessons?.some(
            (id) => id === lessonId
        );

    };


    const getEmbedUrl = (url) => {

        if (!url) return "";
        if (url.includes("youtube.com/watch")) {
            return url.replace("watch?v=", "embed/");
        }
        if (url.includes("youtu.be/")) {
            return url.replace("youtu.be/", "www.youtube.com/embed/");
        }
        return url;

    };

    const isDirectVideo = (url) => {

        return url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

    };

    const handleTimeUpdate = () => {

        const video = videoRef.current;
        if (!video || !video.duration) return;
        const percent = (video.currentTime / video.duration) * 100;
        if (percent >= 80) {
            setVideoWatched(true);
        }

    };

    const handleVideoEnded = () => {

        setVideoWatched(true);

    };

    const hasVideo = Boolean(selectedLesson?.videoUrl);
    const canComplete = !hasVideo || videoWatched || watchConfirmed || isLessonCompleted(selectedLesson?._id);


    return (

        <div className="container-fluid">

            <div className="row g-3">

                {/* Lessons Sidebar */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 rounded-4">

                        <div className="card-body">

                            <h4 className="fw-bold">
                                Course Lessons
                            </h4>


                            {/* Progress */}

                            <div className="mt-3 mb-4">

                                <div className="d-flex justify-content-between">

                                    <strong>
                                        Progress
                                    </strong>

                                    <strong>
                                        {progress.percentage}%
                                    </strong>

                                </div>


                                <div className="progress mt-2" style={{ height: "10px" }}>

                                    <div
                                        className="progress-bar bg-primary"
                                        role="progressbar"
                                        style={{
                                            width: `${progress.percentage}%`
                                        }}
                                    >
                                        {progress.percentage}%
                                    </div>

                                </div>

                            </div>


                            {/* Lessons */}

                            {lessons.map((lesson, index) => (

                                <div
                                    key={lesson._id}
                                    className={`card mb-2 ${selectedLesson?._id === lesson._id
                                        ? "border-primary"
                                        : "border"
                                        }`}
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={() =>
                                        setSelectedLesson(lesson)
                                    }
                                >

                                    <div className="card-body py-3">

                                        <div className="d-flex justify-content-between align-items-start">

                                            <div className="flex-grow-1">

                                                <strong className="d-flex align-items-center gap-2">
                                                    {index + 1}. {lesson.title}
                                                    {lesson.videoUrl && (
                                                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" style={{ fontSize: "0.65rem" }}>
                                                            <i className="bi bi-play-circle me-1"></i>Video
                                                        </span>
                                                    )}
                                                </strong>

                                                <div className="small text-muted mt-1 d-flex gap-2 flex-wrap">
                                                    <span>{lesson.duration}</span>
                                                    {lesson.videoDuration > 0 && (
                                                        <span className="text-primary">
                                                            <i className="bi bi-camera-video me-1"></i>{lesson.videoDuration} min video
                                                        </span>
                                                    )}
                                                </div>

                                            </div>

                                            {isLessonCompleted(lesson._id) && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>


                {/* Lesson Content */}

                <div className="col-md-8">

                    {selectedLesson ? (

                        <div className="card shadow-sm border-0 rounded-4">

                            <div className="card-body p-4">

                                <h2 className="fw-bold">
                                    {selectedLesson.title}
                                </h2>

                                <p className="text-muted">
                                    {selectedLesson.description}
                                </p>

                                <div className="d-flex gap-2 mb-3 flex-wrap">
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-clock me-1"></i>{selectedLesson.duration}
                                    </span>
                                    {selectedLesson.videoUrl && (
                                        <span className="badge bg-primary">
                                            <i className="bi bi-camera-video me-1"></i>Video {selectedLesson.videoDuration ? `• ${selectedLesson.videoDuration} min` : ""} (max 40 min)
                                        </span>
                                    )}
                                </div>

                                <hr />

                                {/* VIDEO PLAYER */}

                                {selectedLesson.videoUrl ? (

                                    <div className="mb-4">

                                        <div className="ratio ratio-16x9 rounded-4 overflow-hidden border bg-black shadow-sm">

                                            {isDirectVideo(selectedLesson.videoUrl) ? (

                                                <video
                                                    ref={videoRef}
                                                    controls
                                                    onTimeUpdate={handleTimeUpdate}
                                                    onEnded={handleVideoEnded}
                                                    onPlay={() => {
                                                        // mark watched after 80% or end
                                                    }}
                                                    src={selectedLesson.videoUrl}
                                                    style={{ background: "#000" }}
                                                />

                                            ) : (

                                                <iframe
                                                    src={getEmbedUrl(selectedLesson.videoUrl)}
                                                    title={selectedLesson.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ border: 0 }}
                                                ></iframe>

                                            )}

                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mt-2">

                                            <small className="text-muted">
                                                <i className="bi bi-info-circle me-1"></i>
                                                {isDirectVideo(selectedLesson.videoUrl)
                                                    ? "Watch at least 80% to unlock completion."
                                                    : "Watch the full video, then confirm below."}
                                            </small>

                                            {selectedLesson.videoDuration > 0 && (
                                                <small className="badge bg-light text-dark border">
                                                    {selectedLesson.videoDuration} / 40 min
                                                </small>
                                            )}

                                        </div>

                                        {/* For YouTube / any video - confirmation checkbox */}
                                        {!isLessonCompleted(selectedLesson._id) && (

                                            <div className="form-check mt-3 p-3 rounded-3" style={{ background: videoWatched || watchConfirmed ? "#f0fdf4" : "#fffbeb", border: `1px solid ${videoWatched || watchConfirmed ? "#bbf7d0" : "#fde68a"}` }}>

                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`watch-${selectedLesson._id}`}
                                                    checked={watchConfirmed}
                                                    onChange={(e) => setWatchConfirmed(e.target.checked)}
                                                />

                                                <label className="form-check-label fw-semibold small" htmlFor={`watch-${selectedLesson._id}`}>

                                                    I have watched the entire video ({selectedLesson.videoDuration || "up to 40"} min)

                                                </label>

                                                {isDirectVideo(selectedLesson.videoUrl) && !videoWatched && !watchConfirmed && (
                                                    <div className="small text-muted mt-1">
                                                        Tip: Play the video to 80% or check the box after watching.
                                                    </div>
                                                )}

                                                {(videoWatched || watchConfirmed) && (
                                                    <div className="small text-success mt-1">
                                                        <i className="bi bi-check-circle me-1"></i> Ready to mark as completed!
                                                    </div>
                                                )}

                                            </div>

                                        )}

                                        {videoWatched && !watchConfirmed && isDirectVideo(selectedLesson.videoUrl) && !isLessonCompleted(selectedLesson._id) && (
                                            <div className="alert alert-success py-2 mt-3 small">
                                                <i className="bi bi-check-circle me-1"></i> Video progress saved! You can now mark as completed.
                                            </div>
                                        )}

                                    </div>

                                ) : (

                                    <div className="alert alert-light border d-flex align-items-center gap-2 small">
                                        <i className="bi bi-file-text text-muted"></i>
                                        Text lesson - no video attached.
                                    </div>

                                )}

                                <div className="bg-light rounded-3 p-3 mb-3">

                                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                                        {selectedLesson.content}
                                    </p>

                                </div>

                                <hr />


                                {isLessonCompleted(
                                    selectedLesson._id
                                ) ? (

                                    <button
                                        className="btn btn-success"
                                        disabled
                                    >
                                        <i className="bi bi-check-circle me-2"></i> Lesson Completed
                                    </button>

                                ) : (

                                    <div>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                completeLesson(
                                                    selectedLesson._id
                                                )
                                            }
                                            disabled={!canComplete}
                                            title={!canComplete ? "Please watch the video and confirm before completing" : ""}
                                        >
                                            <i className="bi bi-check-lg me-1"></i>
                                            Mark as Completed
                                        </button>

                                        {!canComplete && hasVideo && (
                                            <div className="small text-danger mt-2">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                Please watch the video and check the confirmation box to unlock completion.
                                            </div>
                                        )}

                                    </div>

                                )}


                                {progress.completed && (

                                    <div className="alert alert-success mt-4 d-flex align-items-center gap-2">
                                        <i className="bi bi-mortarboard fs-5"></i>
                                        <div>
                                            <strong>Congratulations!</strong>
                                            <br />
                                            You have completed this course.
                                        </div>
                                    </div>

                                )}

                            </div>

                        </div>

                    ) : (

                        <div className="alert alert-info">
                            No lessons available.
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default CourseLearning;
