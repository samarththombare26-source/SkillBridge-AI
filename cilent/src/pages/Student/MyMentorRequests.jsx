import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MyMentorRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        fetchRequests();

    }, []);


    const fetchRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/mentor/my-requests"
            );

            setRequests(
                response.data.requests || []
            );

        } catch (error) {

            console.error(
                "My Mentor Requests Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load mentor requests"
            );

        } finally {

            setLoading(false);

        }

    };


    // Status badge

    const getStatusBadge = (status) => {

        switch (status) {

            case "Accepted":

                return (
                    <span className="badge text-bg-success">
                        Accepted
                    </span>
                );

            case "Rejected":

                return (
                    <span className="badge text-bg-danger">
                        Rejected
                    </span>
                );

            default:

                return (
                    <span className="badge text-bg-warning">
                        Pending
                    </span>
                );
        }

    };


    return (

        <div className="container py-4 py-md-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>

                    <h1 className="fw-bold">
                        My Mentor Requests
                    </h1>

                    <p className="text-muted mb-0">
                        Track the mentorship requests
                        you have sent.
                    </p>

                </div>


                <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                        navigate(
                            "/student/mentors"
                        )
                    }
                >
                    Find Mentors
                </button>

            </div>


            {/* Loading */}

            {loading && (

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3">
                        Loading requests...
                    </p>

                </div>

            )}


            {/* Error */}

            {!loading && error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* No Requests */}

            {!loading &&
                !error &&
                requests.length === 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                <i className="bi bi-envelope"></i>
                            </div>

                            <h4 className="fw-bold">
                                No Mentor Requests
                            </h4>

                            <p className="text-muted">
                                You haven't sent any mentorship
                                requests yet.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "/student/mentors"
                                    )
                                }
                            >
                                Find a Mentor
                            </button>

                        </div>

                    </div>

                )}


            {/* Requests */}

            {!loading &&
                !error &&
                requests.length > 0 && (

                    <div className="row g-4">

                        {requests.map((request) => (

                            <div
                                className="col-12 col-lg-6"
                                key={request._id}
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        {/* Mentor */}

                                        <div className="d-flex align-items-center mb-3">

                                            <div
                                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    fontSize: "22px"
                                                }}
                                            >
                                                {request.mentor?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>


                                            <div>

                                                <h5 className="fw-bold mb-1">

                                                    {request.mentor?.name ||
                                                        "Mentor"}

                                                </h5>

                                                <p className="text-primary mb-0">

                                                    {request.mentor?.expertise ||
                                                        "Expertise not available"}

                                                </p>

                                            </div>

                                        </div>


                                        <hr />


                                        {/* Experience */}

                                        {request.mentor?.experience && (

                                            <p className="text-muted">

                                                <strong>
                                                    Experience:
                                                </strong>{" "}

                                                {request.mentor.experience}

                                            </p>

                                        )}


                                        {/* Message */}

                                        <div className="mb-3">

                                            <h6 className="fw-bold">
                                                Your Message
                                            </h6>

                                            <p className="text-muted">
                                                {request.message}
                                            </p>

                                        </div>


                                        {/* Status */}

                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                                            <div>

                                                <strong>
                                                    Status:
                                                </strong>{" "}

                                                {getStatusBadge(
                                                    request.status
                                                )}

                                            </div>


                                            {request.createdAt && (

                                                <small className="text-muted">

                                                    {new Date(
                                                        request.createdAt
                                                    ).toLocaleDateString()}

                                                </small>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default MyMentorRequests;