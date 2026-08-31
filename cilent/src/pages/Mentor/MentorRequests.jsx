import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MentorRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [processingId, setProcessingId] = useState(null);

    const [filter, setFilter] = useState("All");

    const [toast, setToast] = useState(null);


    useEffect(() => {

        fetchRequests();

    }, []);


    const fetchRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get(
                    "/mentor/mentor-requests"
                );

            setRequests(
                response.data.requests || []
            );

        } catch (err) {

            console.error(
                "Get Mentor Requests Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load requests"
            );

        } finally {

            setLoading(false);

        }

    };


    const showToast = (type, message) => {

        setToast({ type, message });

        setTimeout(
            () => setToast(null),
            3000
        );

    };


    // ======================================
    // ACCEPT REQUEST
    // ======================================

    const handleAccept = async (requestId) => {

        try {

            setProcessingId(requestId);

            const response =
                await API.patch(
                    `/mentor/request/${requestId}/accept`
                );

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === requestId
                        ? {
                            ...request,
                            status: "Accepted"
                        }
                        : request
                )
            );

            showToast(
                "success",
                response.data.message ||
                "Request accepted"
            );

        } catch (err) {

            showToast(
                "danger",
                err.response?.data?.message ||
                "Failed to accept request"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ======================================
    // REJECT REQUEST
    // ======================================

    const handleReject = async (requestId) => {

        try {

            setProcessingId(requestId);

            const response =
                await API.patch(
                    `/mentor/request/${requestId}/reject`
                );

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === requestId
                        ? {
                            ...request,
                            status: "Rejected"
                        }
                        : request
                )
            );

            showToast(
                "danger",
                response.data.message ||
                "Request rejected"
            );

        } catch (err) {

            showToast(
                "danger",
                err.response?.data?.message ||
                "Failed to reject request"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ======================================
    // MESSAGE STUDENT
    // ======================================

    const handleMessage = async (student) => {

        try {

            const response = await API.post(
                "/conversations",
                {
                    studentId: student._id
                }
            );

            navigate(
                `/mentor/conversation/${response.data.conversation._id}`
            );

        } catch (err) {

            showToast(
                "danger",
                err.response?.data?.message ||
                "Failed to open chat"
            );

        }

    };


    // ======================================
    // FILTERING
    // ======================================

    const countBy = (status) =>
        requests.filter(
            (r) => r.status === status
        ).length;


    const filters = [

        { name: "All", count: requests.length },

        { name: "Pending", count: countBy("Pending") },

        { name: "Accepted", count: countBy("Accepted") },

        { name: "Rejected", count: countBy("Rejected") }

    ];


    const visibleRequests =
        filter === "All"
            ? requests
            : requests.filter(
                (r) => r.status === filter
            );


    // ======================================
    // STATUS BADGE
    // ======================================

    const getStatusBadge = (status) => {

        if (status === "Accepted") {

            return (
                <span className="badge text-bg-success">
                    Accepted
                </span>
            );

        }

        if (status === "Rejected") {

            return (
                <span className="badge text-bg-danger">
                    Rejected
                </span>
            );

        }

        return (
            <span className="badge text-bg-warning">
                Pending
            </span>
        );

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading student requests...
                </p>

            </div>

        );

    }


    return (

        <div>


            {/* TOAST */}

            {toast && (

                <div
                    className={`alert alert-${toast.type} d-flex align-items-center py-2 shadow-sm`}
                    role="alert"
                    style={{
                        position: "fixed",
                        top: "90px",
                        right: "24px",
                        zIndex: 1055,
                        minWidth: "280px"
                    }}
                >

                    <i
                        className={`bi ${
                            toast.type === "success"
                                ? "bi-check-circle-fill"
                                : "bi-exclamation-circle-fill"
                        } me-2`}
                    ></i>

                    {toast.message}

                </div>

            )}


            {/* HEADER */}

            <div className="mb-4">

                <h4 className="fw-bold mb-1">
                    Student Requests
                </h4>

                <p className="text-muted mb-0">

                    Review mentorship requests sent by students.

                </p>

            </div>


            {/* FILTER TABS */}

            <div className="d-flex flex-wrap gap-2 mb-4">

                {filters.map((f) => (

                    <button
                        key={f.name}
                        className={`btn btn-sm rounded-pill px-3 ${
                            filter === f.name
                                ? "btn-primary"
                                : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                            setFilter(f.name)
                        }
                    >

                        {f.name}

                        <span
                            className="badge ms-2"
                            style={{
                                background:
                                    filter === f.name
                                        ? "rgba(255,255,255,0.25)"
                                        : "#e9ecef",
                                color:
                                    filter === f.name
                                        ? "#fff"
                                        : "#495057"
                            }}
                        >

                            {f.count}

                        </span>

                    </button>

                ))}

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* EMPTY STATE */}

            {!error &&
                visibleRequests.length === 0 && (

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                <i className="bi bi-envelope"></i>
                            </div>

                            <h4 className="fw-bold">

                                {filter === "All"
                                    ? "No Student Requests"
                                    : `No ${filter} Requests`}

                            </h4>

                            <p className="text-muted mb-0">

                                {filter === "Pending"
                                    ? "You're all caught up!"
                                    : "Check back later."}

                            </p>

                        </div>

                    </div>

                )}


            {/* REQUEST LIST */}

            {!error &&
                visibleRequests.length > 0 && (

                    <div className="row g-4">

                        {visibleRequests.map((request) => (

                            <div
                                className="col-lg-6"
                                key={request._id}
                            >

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">


                                        {/* STUDENT */}

                                        <div className="d-flex align-items-center mb-3">

                                            <div
                                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    fontSize: "22px",
                                                    flexShrink: 0
                                                }}
                                            >

                                                {request.student?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "S"}

                                            </div>


                                            <div className="flex-grow-1">

                                                <h5 className="fw-bold mb-1">

                                                    {request.student?.name ||
                                                        "Student"}

                                                </h5>

                                                <p className="text-muted mb-0 small">

                                                    {request.student?.email ||
                                                        "Email unavailable"}

                                                </p>

                                            </div>


                                            {getStatusBadge(
                                                request.status
                                            )}

                                        </div>


                                        <hr />


                                        {/* MESSAGE */}

                                        <h6 className="fw-bold small text-uppercase text-muted">

                                            Student Message

                                        </h6>

                                        <p className="text-muted mb-3">

                                            {request.message}

                                        </p>


                                        {/* DATE */}

                                        {request.createdAt && (

                                            <p className="small text-muted">

                                                <i className="bi bi-clock me-1"></i>

                                                Sent on{" "}

                                                {new Date(
                                                    request.createdAt
                                                ).toLocaleDateString()}

                                            </p>

                                        )}


                                        {/* ACTIONS */}

                                        {request.status ===
                                            "Pending" && (

                                            <div className="d-flex gap-2 flex-wrap">

                                                <button
                                                    className="btn btn-success flex-fill"
                                                    disabled={
                                                        processingId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleAccept(
                                                            request._id
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-check-lg me-1"></i>

                                                    Accept

                                                </button>


                                                <button
                                                    className="btn btn-outline-danger flex-fill"
                                                    disabled={
                                                        processingId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            request._id
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-x-lg me-1"></i>

                                                    Reject

                                                </button>

                                            </div>

                                        )}


                                        {request.status ===
                                            "Accepted" && (

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    handleMessage(
                                                        request.student
                                                    )
                                                }
                                            >

                                                <i className="bi bi-chat-dots me-2"></i>

                                                Message Student

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>

    );

}

export default MentorRequests;
