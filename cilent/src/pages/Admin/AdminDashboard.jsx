import { useNavigate } from "react-router-dom";

import AdminDashboardCards from "./AdminDashboardCards";

function AdminDashboard() {

    const navigate = useNavigate();

    return (

        <div>

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Admin Dashboard
                </h2>

                <p className="text-muted mb-0">
                    Manage your platform, courses,
                    users and career opportunities.
                </p>

            </div>


            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" }}>
                    <div className="row align-items-center">
                        <div className="col-md-8 text-white">
                            <h5 className="fw-bold mb-2"><i className="bi bi-speedometer2 me-2"></i> Platform at a glance</h5>
                            <p className="mb-3 opacity-75 small">Monitor courses, lessons, users and internships. Keep your platform thriving.</p>
                            <button className="btn btn-light text-dark fw-bold btn-sm" onClick={() => navigate("/admin/users")}>Manage Users <i className="bi bi-arrow-right ms-2"></i></button>
                        </div>
                        <div className="col-md-4 text-center d-none d-md-block">
                            <i className="bi bi-shield-check text-white" style={{ fontSize: "3rem", opacity: 0.25 }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================
                STATISTICS
            ================================= */}

            <AdminDashboardCards />


            {/* =================================
                MANAGEMENT SECTION
            ================================= */}

            <div className="mb-3 mt-5">

                <h4 className="fw-bold">
                    Platform Management
                </h4>

                <p className="text-muted">
                    Quickly access important administration tools.
                </p>

            </div>


            <div className="row g-4">


                {/* =================================
                    COURSES
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-book fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Courses
                                </h5>

                            </div>

                            <p className="text-muted">
                                Create, edit and manage courses
                                available to students.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate("/admin/courses")
                                }
                            >

                                Manage Courses

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================
                    LESSONS
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-journal-text fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Lessons
                                </h5>

                            </div>

                            <p className="text-muted">
                                Add and manage lessons for
                                your courses.
                            </p>

                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    navigate("/admin/lessons")
                                }
                            >

                                Manage Lessons

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================
                    USERS
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-dark bg-opacity-10 text-dark rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-people fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Users
                                </h5>

                            </div>

                            <p className="text-muted">
                                View and manage registered
                                SkillBridgeAI users.
                            </p>

                            <button
                                className="btn btn-dark"
                                onClick={() =>
                                    navigate("/admin/users")
                                }
                            >

                                Manage Users

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================
                    CAREER ROADMAPS
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-signpost-split fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Career Roadmaps
                                </h5>

                            </div>

                            <p className="text-muted">
                                Create structured career
                                roadmaps for students.
                            </p>

                            <button
                                className="btn btn-warning"
                                onClick={() =>
                                    navigate(
                                        "/admin/create-roadmap"
                                    )
                                }
                            >

                                Manage Roadmaps

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================
                    INTERNSHIPS
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-briefcase fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Internships
                                </h5>

                            </div>

                            <p className="text-muted">
                                Create internship opportunities
                                for students.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "/admin/create-internship"
                                    )
                                }
                            >

                                Manage Internships

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================
                    SYSTEM
                ================================= */}

                <div className="col-md-6 col-xl-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i className="bi bi-gear fs-4"></i>

                                </div>

                                <h5 className="fw-bold mb-0">
                                    Administration
                                </h5>

                            </div>

                            <p className="text-muted">
                                Manage and monitor your
                                SkillBridgeAI platform.
                            </p>

                            <span className="badge bg-success">
                                System Active
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================
                FOOTER
            ================================= */}

            <div className="text-center text-muted py-5">

                <small>
                    SkillBridgeAI Administration Panel
                </small>

            </div>

        </div>

    );

}

export default AdminDashboard;
