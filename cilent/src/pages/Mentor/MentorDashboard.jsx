import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axiosInstance";


function MentorDashboard() {

    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);

    const [requests, setRequests] = useState([]);

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [processingId, setProcessingId] = useState(null);

    const [toast, setToast] = useState("");


    useEffect(() => {

        fetchDashboardData();

    }, []);


    // ==========================================
    // LOAD PROFILE + REQUESTS + STUDENTS
    // ==========================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);


            const [
                profileRes,
                requestsRes,
                studentsRes
            ] = await Promise.allSettled([

                API.get("/mentor/profile"),

                API.get("/mentor/mentor-requests"),

                API.get("/mentor/my-students")

            ]);


            if (
                profileRes.status === "fulfilled"
            ) {

                setMentor(
                    profileRes.value.data.mentor
                );

            } else {

                setMentor(null);

            }


            if (
                requestsRes.status === "fulfilled"
            ) {

                setRequests(
                    requestsRes.value.data.requests || []
                );

            }


            if (
                studentsRes.status === "fulfilled"
            ) {

                setStudents(
                    studentsRes.value.data.students || []
                );

            }

        } catch (error) {

            console.log(
                "Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // SHOW TOAST MESSAGE
    // ==========================================

    const showToast = (message) => {

        setToast(message);

        setTimeout(
            () => setToast(""),
            3000
        );

    };


    // ==========================================
    // QUICK ACCEPT / REJECT
    // ==========================================

    const handleRequest = async (
        requestId,
        action
    ) => {

        try {

            setProcessingId(requestId);

            const response = await API.patch(
                `/mentor/request/${requestId}/${action}`
            );

            setRequests((prev) =>
                prev.map((r) =>
                    r._id === requestId
                        ? {
                            ...r,
                            status:
                                action === "accept"
                                    ? "Accepted"
                                    : "Rejected"
                        }
                        : r
                )
            );

            showToast(
                response.data.message ||
                `Request ${action}ed`
            );

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Action failed"
            );

        } finally {

            setProcessingId(null);

        }

    };


    const pendingRequests = requests.filter(
        (r) => r.status === "Pending"
    );

    const recentPending = pendingRequests.slice(
        0,
        3
    );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3 mb-0">

                    Loading mentor dashboard...

                </p>

            </div>

        );

    }


    return (

        <div>

            {/* =================================
                TOAST
            ================================= */}

            {toast && (

                <div
                    className="alert alert-success d-flex align-items-center py-2 shadow-sm"
                    role="alert"
                    style={{
                        position: "fixed",
                        top: "90px",
                        right: "24px",
                        zIndex: 1055,
                        minWidth: "280px"
                    }}
                >

                    <i className="bi bi-check-circle-fill me-2"></i>

                    {toast}

                </div>

            )}


            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="mb-4">

                <h4 className="fw-bold mb-1">

                    Mentor Dashboard

                </h4>

                <p className="text-muted mb-0">

                    Manage your mentorship, students and professional profile.

                </p>

            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}>
                    <div className="row align-items-center">
                        <div className="col-md-8 text-white">
                            <h5 className="fw-bold mb-2"><i className="bi bi-people-fill me-2"></i> Inspire the next generation</h5>
                            <p className="mb-3 opacity-75 small">You have {requests.filter(r=>r.status==="Pending").length} pending requests and {students.length} active students. Keep mentoring!</p>
                            <button className="btn btn-light text-primary fw-bold btn-sm" onClick={() => navigate("/mentor/requests")}>Review Requests <i className="bi bi-arrow-right ms-2"></i></button>
                        </div>
                        <div className="col-md-4 text-center d-none d-md-block">
                            <i className="bi bi-mortarboard text-white" style={{ fontSize: "3rem", opacity: 0.25 }}></i>
                        </div>
                    </div>
                </div>
            </div>


            {/* =================================
                LIVE STATISTICS
            ================================= */}

            <div className="row g-4 mb-4">

                {/* PENDING REQUESTS */}

                <div className="col-sm-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm rounded-4 h-100"
                        role="button"
                        onClick={() =>
                            navigate("/mentor/requests")
                        }
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Pending Requests
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {pendingRequests.length}
                                    </h2>

                                    <small className="text-muted">
                                        Awaiting your response
                                    </small>

                                </div>


                                <div className="icon-chip warning">

                                    <i className="bi bi-inbox"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* CONNECTED STUDENTS */}

                <div className="col-sm-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm rounded-4 h-100"
                        role="button"
                        onClick={() =>
                            navigate("/mentor/my-students")
                        }
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        My Students
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {students.length}
                                    </h2>

                                    <small className="text-muted">
                                        Connected mentees
                                    </small>

                                </div>


                                <div className="icon-chip success">

                                    <i className="bi bi-people"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* AVAILABILITY */}

                <div className="col-sm-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm rounded-4 h-100"
                        role="button"
                        onClick={() =>
                            navigate("/mentor/profile")
                        }
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Availability
                                    </p>

                                    <h2
                                        className="fw-bold mb-1"
                                        style={{ fontSize: "1.4rem" }}
                                    >

                                        {mentor?.availability || "Not Set"}

                                    </h2>

                                    <small className="text-muted">
                                        Your current status
                                    </small>

                                </div>


                                <div className="icon-chip info">

                                    <i className="bi bi-calendar-check"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PROFILE STATUS */}

                <div className="col-sm-6 col-xl-3">

                    <div
                        className="card border-0 shadow-sm rounded-4 h-100"
                        role="button"
                        onClick={() =>
                            navigate("/mentor/profile")
                        }
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        Mentor Profile
                                    </p>

                                    <h2
                                        className="fw-bold mb-1"
                                        style={{ fontSize: "1.4rem" }}
                                    >

                                        {mentor ? "Active" : "Not Created"}

                                    </h2>

                                    <small className="text-muted">
                                        {mentor
                                            ? `${mentor.expertise || "No expertise"}`
                                            : "Create your profile"}
                                    </small>

                                </div>


                                <div
                                    className={
                                        mentor
                                            ? "icon-chip primary"
                                            : "icon-chip danger"
                                    }
                                >

                                    <i className="bi bi-person-workspace"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================
                RECENT PENDING REQUESTS
            ================================= */}

            <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body p-4">


                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>

                            <h5 className="fw-bold mb-1">

                                Recent Requests

                            </h5>

                            <small className="text-muted">

                                Quickly accept or reject pending requests

                            </small>

                        </div>


                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                                navigate("/mentor/requests")
                            }
                        >

                            View All

                            <i className="bi bi-arrow-right ms-1"></i>

                        </button>

                    </div>


                    {recentPending.length === 0 ? (

                        <div className="text-center py-4 text-muted">

                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>

                            No pending requests right now.

                        </div>

                    ) : (

                        <div className="d-flex flex-column gap-3">

                            {recentPending.map((request) => (

                                <div
                                    className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-4 border"
                                    key={request._id}
                                    style={{
                                        borderColor: "#edf0f7",
                                        background: "#f8fafc"
                                    }}
                                >

                                    <div className="d-flex align-items-center gap-3">

                                        <div
                                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                            style={{
                                                width: "46px",
                                                height: "46px",
                                                fontSize: "18px",
                                                flexShrink: 0
                                            }}
                                        >

                                            {request.student?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "S"}

                                        </div>


                                        <div>

                                            <div className="fw-semibold">

                                                {request.student?.name || "Student"}

                                            </div>

                                            <small className="text-muted">

                                                {request.message?.length > 60
                                                    ? `${request.message.slice(0, 60)}...`
                                                    : request.message}

                                            </small>

                                        </div>

                                    </div>


                                    <div className="d-flex gap-2">

                                        <button
                                            className="btn btn-success btn-sm"
                                            disabled={
                                                processingId === request._id
                                            }
                                            onClick={() =>
                                                handleRequest(
                                                    request._id,
                                                    "accept"
                                                )
                                            }
                                        >

                                            <i className="bi bi-check-lg me-1"></i>

                                            Accept

                                        </button>


                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            disabled={
                                                processingId === request._id
                                            }
                                            onClick={() =>
                                                handleRequest(
                                                    request._id,
                                                    "reject"
                                                )
                                            }
                                        >

                                            <i className="bi bi-x-lg me-1"></i>

                                            Reject

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>


            {/* =================================
                PROFILE + AVAILABILITY OVERVIEW
            ================================= */}

            <div className="row g-4 mb-4">


                {/* PROFILE SUMMARY */}

                <div className="col-lg-7">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">


                            <div className="d-flex justify-content-between align-items-start mb-4">

                                <div className="d-flex align-items-center">

                                    <div className="icon-chip primary me-3">

                                        <i className="bi bi-person-workspace"></i>

                                    </div>


                                    <div>

                                        <h5 className="fw-bold mb-1">

                                            Mentor Profile

                                        </h5>

                                        <small className="text-muted">

                                            Your professional information

                                        </small>

                                    </div>

                                </div>


                                {mentor && (

                                    <span className="badge bg-success">

                                        Active

                                    </span>

                                )}

                            </div>


                            {mentor ? (

                                <>


                                    <div className="row g-3 mb-4">


                                        <div className="col-md-6">

                                            <small className="text-muted">

                                                Name

                                            </small>

                                            <div className="fw-semibold">

                                                {mentor.name}

                                            </div>

                                        </div>


                                        <div className="col-md-6">

                                            <small className="text-muted">

                                                Email

                                            </small>

                                            <div className="fw-semibold">

                                                {mentor.email}

                                            </div>

                                        </div>


                                        <div className="col-md-6">

                                            <small className="text-muted">

                                                Expertise

                                            </small>

                                            <div className="fw-semibold">

                                                {mentor.expertise}

                                            </div>

                                        </div>


                                        <div className="col-md-6">

                                            <small className="text-muted">

                                                Experience

                                            </small>

                                            <div className="fw-semibold">

                                                {mentor.experience}

                                            </div>

                                        </div>


                                    </div>


                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate(
                                                "/mentor/profile"
                                            )
                                        }
                                    >

                                        <i className="bi bi-pencil me-2"></i>

                                        Edit Profile

                                    </button>


                                </>

                            ) : (

                                <div>

                                    <p className="text-muted">

                                        You haven't created your mentor
                                        profile yet. Create your profile
                                        so students can discover and
                                        connect with you.

                                    </p>


                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate(
                                                "/mentor/profile"
                                            )
                                        }
                                    >

                                        <i className="bi bi-plus-circle me-2"></i>

                                        Create Mentor Profile

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* MENTORSHIP SUMMARY */}

                <div className="col-lg-5">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-4">

                                Mentorship Summary

                            </h5>


                            <div className="d-flex flex-column gap-3">


                                <div
                                    className="d-flex align-items-center justify-content-between p-3 rounded-4 border"
                                    style={{ borderColor: "#edf0f7" }}
                                >

                                    <div className="d-flex align-items-center gap-3">

                                        <div className="icon-chip warning" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                            <i className="bi bi-hourglass-split"></i>

                                        </div>

                                        <span className="fw-semibold">

                                            Pending Requests

                                        </span>

                                    </div>

                                    <span className="badge text-bg-warning">

                                        {pendingRequests.length}

                                    </span>

                                </div>


                                <div
                                    className="d-flex align-items-center justify-content-between p-3 rounded-4 border"
                                    style={{ borderColor: "#edf0f7" }}
                                >

                                    <div className="d-flex align-items-center gap-3">

                                        <div className="icon-chip success" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                            <i className="bi bi-people"></i>

                                        </div>

                                        <span className="fw-semibold">

                                            Total Requests

                                        </span>

                                    </div>

                                    <span className="badge text-bg-secondary">

                                        {requests.length}

                                    </span>

                                </div>


                                <div
                                    className="d-flex align-items-center justify-content-between p-3 rounded-4 border"
                                    style={{ borderColor: "#edf0f7" }}
                                >

                                    <div className="d-flex align-items-center gap-3">

                                        <div className="icon-chip primary" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                            <i className="bi bi-mortarboard"></i>

                                        </div>

                                        <span className="fw-semibold">

                                            Active Students

                                        </span>

                                    </div>

                                    <span className="badge text-bg-primary">

                                        {students.length}

                                    </span>

                                </div>

                            </div>


                            <button
                                className="btn btn-outline-primary w-100 mt-4"
                                onClick={() =>
                                    navigate(
                                        "/mentor/my-students"
                                    )
                                }
                            >

                                <i className="bi bi-chat-dots me-2"></i>

                                Message Students

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default MentorDashboard;
