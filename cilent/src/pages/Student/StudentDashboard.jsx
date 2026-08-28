import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import { isSaved, toggleSave } from "../../utils/bookmark";


function StudentDashboard() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const [, forceUpdate] = useState(0);


    useEffect(() => {

        getCourses();

        getMyEnrollments();

    }, []);


    const getCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(response.data.courses || []);

        } catch (error) {

            console.log("Courses Error:", error);

        }

    };


    const getMyEnrollments = async () => {

        try {

            const response = await API.get(
                "/enrollments/my-enrollments"
            );

            setEnrolledCourses(
                response.data.enrollments || []
            );

        } catch (error) {

            console.log("Enrollment Error:", error);

        }

    };


    const handleEnroll = async (courseId) => {

        try {

            const response = await API.post(
                "/enrollments/enroll",
                {
                    courseId: courseId
                }
            );

            alert(response.data.message);

            getMyEnrollments();

        } catch (error) {

            console.log("Enrollment Error:", error);

            alert(
                error.response?.data?.message ||
                "Enrollment failed"
            );

        }

    };


    const isEnrolled = (courseId) => {

        return enrolledCourses.some(
            (enrollment) =>
                enrollment.course?._id === courseId
        );

    };


    return (

        <div>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="mb-4">

                <h4 className="fw-bold mb-1">
                    Student Dashboard
                </h4>

                <p className="text-muted mb-0">
                    Track your learning, career and professional growth.
                </p>

            </div>

            {/* WELCOME BANNER - REAL PLATFORM FEEL */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }}>
                    <div className="row align-items-center">
                        <div className="col-md-8 text-white">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-white text-primary"><i className="bi bi-stars me-1"></i> New</span>
                                <small className="opacity-75">3 new internships for you</small>
                            </div>
                            <h4 className="fw-bold mb-2">Ready to level up, {JSON.parse(localStorage.getItem("user") || "{}")?.name?.split(" ")[0] || "Student"}?</h4>
                            <p className="mb-3 opacity-75 small">Complete your next lesson and earn a certificate. Your progress is 75% — keep going!</p>
                            <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-light text-primary fw-bold btn-sm" onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}>Continue Learning <i className="bi bi-arrow-right ms-2"></i></button>
                                <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/student/internships")}>Explore Internships</button>
                            </div>
                        </div>
                        <div className="col-md-4 text-center d-none d-md-block">
                            <div className="bg-white bg-opacity-10 rounded-4 p-3 d-inline-block">
                                <i className="bi bi-rocket-takeoff text-white" style={{ fontSize: "3.5rem" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* ==================================
                STATISTICS
            ================================== */}

            <DashboardCards />


            {/* ==================================
                CAREER + RESUME
            ================================== */}

            <div className="row g-4 mb-4">


                {/* Career Roadmap */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >

                                    <i className="bi bi-signpost-2 fs-4"></i>

                                </div>

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Career Roadmap
                                    </h5>

                                    <small className="text-muted">
                                        Plan your career journey
                                    </small>

                                </div>

                            </div>


                            <p className="text-muted">

                                Discover career paths and follow
                                step-by-step learning plans designed
                                for your goals.

                            </p>


                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "/career-roadmaps"
                                    )
                                }
                            >

                                Explore Roadmaps

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* Resume Builder */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >

                                    <i className="bi bi-file-earmark-person fs-4"></i>

                                </div>

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Resume Builder
                                    </h5>

                                    <small className="text-muted">
                                        Build your professional resume
                                    </small>

                                </div>

                            </div>


                            <p className="text-muted">

                                Create and save your professional
                                resume for internships and job
                                opportunities.

                            </p>


                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    navigate(
                                        "/student/resume-builder"
                                    )
                                }
                            >

                                Build My Resume

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                INTERNSHIPS + MENTORS
            ================================== */}

            <div className="row g-4 mb-4">


                {/* Internship */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >

                                    <i className="bi bi-briefcase fs-4"></i>

                                </div>

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Internship Opportunities
                                    </h5>

                                    <small className="text-muted">
                                        Find your next opportunity
                                    </small>

                                </div>

                            </div>


                            <p className="text-muted">

                                Explore internships and start
                                building your professional career.

                            </p>


                            <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    navigate(
                                        "/student/internships"
                                    )
                                }
                            >

                                Explore Internships

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* Mentor Support */}

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >

                                    <i className="bi bi-person-workspace fs-4"></i>

                                </div>

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Mentor Support
                                    </h5>

                                    <small className="text-muted">
                                        Get guidance from mentors
                                    </small>

                                </div>

                            </div>


                            <p className="text-muted">

                                Connect with experienced mentors
                                and get personalized career guidance.

                            </p>


                            <div className="d-flex gap-2 flex-wrap">

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate(
                                            "/student/mentors"
                                        )
                                    }
                                >
                                    Find Mentors
                                </button>


                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate(
                                            "/student/my-mentors"
                                        )
                                    }
                                >
                                    My Mentors
                                </button>


                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        navigate(
                                            "/student/mentor-requests"
                                        )
                                    }
                                >
                                    My Requests
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "48px",
                                        height: "48px"
                                    }}
                                >

                                    <i className="bi bi-stars fs-4"></i>

                                </div>

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        AI Career Recommendation
                                    </h5>

                                    <small className="text-muted">
                                        Discover your ideal career path
                                    </small>

                                </div>

                            </div>

                            <p className="text-muted">

                                Get personalized career recommendations
                                based on your skills, interests and goals.

                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "/student/career-recommendation"
                                    )
                                }
                            >

                                Get Career Recommendation

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                AVAILABLE COURSES
            ================================== */}

            <div id="courses-section" className="mb-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h4 className="fw-bold mb-1">
                            Available Courses
                        </h4>

                        <p className="text-muted mb-0">
                            Continue learning and build your skills.
                        </p>

                    </div>

                </div>


                <div className="row g-4">

                    {courses.length === 0 ? (

                        <div className="col-12">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body text-center py-5">

                                    <i className="bi bi-book fs-1 text-muted"></i>

                                    <p className="text-muted mt-3 mb-0">
                                        No courses available right now.
                                    </p>

                                </div>

                            </div>

                        </div>

                    ) : (

                        courses.map((course) => (

                            <div
                                className="col-md-6 col-xl-4"
                                key={course._id}
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                                {course.category}
                                            </span>
                                            <button className={`btn btn-sm ${isSaved("courses", course._id) ? "btn-warning" : "btn-outline-secondary"} py-1 px-2`} onClick={() => { toggleSave("courses", course); forceUpdate((x) => x + 1); }} title={isSaved("courses", course._id) ? "Saved" : "Save"}>
                                                <i className={`bi ${isSaved("courses", course._id) ? "bi-bookmark-heart-fill" : "bi-bookmark-heart"}`}></i>
                                            </button>
                                        </div>


                                        <h5 className="fw-bold">
                                            {course.title}
                                        </h5>


                                        <p className="text-muted small">
                                            {course.description}
                                        </p>


                                        <div className="small text-muted mb-3">

                                            <div className="mb-1">

                                                <i className="bi bi-person me-2"></i>

                                                {course.instructor}

                                            </div>


                                            <div className="mb-1">

                                                <i className="bi bi-clock me-2"></i>

                                                {course.duration}

                                            </div>


                                            <div>

                                                <i className="bi bi-bar-chart me-2"></i>

                                                {course.level}

                                            </div>

                                        </div>


                                        {isEnrolled(course._id) ? (

                                            <button
                                                className="btn btn-success w-100"
                                                disabled
                                            >

                                                <i className="bi bi-check-circle me-2"></i>

                                                Enrolled

                                            </button>

                                        ) : (

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    handleEnroll(
                                                        course._id
                                                    )
                                                }
                                            >

                                                Enroll Now

                                                <i className="bi bi-arrow-right ms-2"></i>

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* NEW STRONG FEATURES */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #2563eb" }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: "48px", height: "48px" }}>
                                    <i className="bi bi-patch-question fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">AI Skill Quiz</h5>
                                    <small className="text-muted">Test your knowledge with Gemini</small>
                                </div>
                                <span className="badge bg-primary ms-auto">NEW</span>
                            </div>
                            <p className="text-muted">Generate personalized quizzes on any topic, get instant AI feedback and level assessment.</p>
                            <button className="btn btn-primary" onClick={() => navigate("/student/skill-quiz")}>Start Quiz <i className="bi bi-arrow-right ms-2"></i></button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #f59e0b" }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: "48px", height: "48px" }}>
                                    <i className="bi bi-bookmark-heart fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Saved Items</h5>
                                    <small className="text-muted">Your bookmarks in one place</small>
                                </div>
                            </div>
                            <p className="text-muted">Access your saved internships and courses instantly. Bookmark any card with the heart icon.</p>
                            <button className="btn btn-warning" onClick={() => navigate("/student/saved")}>View Saved <i className="bi bi-arrow-right ms-2"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================
                AVAILABLE COURSES
            ================================== */}

            <div className="mb-5">

                <div className="mb-4">

                    <h4 className="fw-bold mb-1">
                        My Learning
                    </h4>

                    <p className="text-muted mb-0">
                        Courses you are currently learning.
                    </p>

                </div>


                {enrolledCourses.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i className="bi bi-mortarboard fs-1 text-muted"></i>

                            <h6 className="fw-bold mt-3">
                                No enrolled courses
                            </h6>

                            <p className="text-muted mb-3">
                                Start learning by enrolling in a course.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    document
                                        .getElementById("courses-section")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        })
                                }
                            >
                                Browse Courses
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {enrolledCourses.map((enrollment) => (

                            <div
                                className="col-md-6 col-xl-4"
                                key={enrollment._id}
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-start mb-3">

                                            <h5 className="fw-bold mb-0">

                                                {enrollment.course?.title}

                                            </h5>


                                            <span className="badge bg-success">

                                                {enrollment.status}

                                            </span>

                                        </div>


                                        <p className="text-muted small">

                                            {enrollment.course?.description}

                                        </p>


                                        <button
                                            className="btn btn-primary w-100 mt-2"
                                            onClick={() =>
                                                navigate(
                                                    `/student/course/${enrollment.course?._id}`
                                                )
                                            }
                                        >

                                            Continue Learning

                                            <i className="bi bi-arrow-right ms-2"></i>

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default StudentDashboard;
