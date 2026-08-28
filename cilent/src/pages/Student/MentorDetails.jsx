import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import API from "../../api/axiosInstance";

function MentorDetails() {

    const { mentorId } = useParams();

    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================
    // FETCH MENTOR
    // ======================================

    useEffect(() => {

        fetchMentor();

    }, [mentorId]);


    const fetchMentor = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                `/mentor/${mentorId}`
            );

            setMentor(
                response.data.mentor
            );

        } catch (error) {

            console.error(
                "Get Mentor Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load mentor profile"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // AVAILABILITY BADGE
    // ======================================

    const getAvailabilityClass = () => {

        if (mentor?.availability === "Available") {
            return "badge text-bg-success";
        }

        if (mentor?.availability === "Busy") {
            return "badge text-bg-warning";
        }

        return "badge text-bg-secondary";

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="container py-5">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3">
                        Loading mentor profile...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // ERROR
    // ======================================

    if (error) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/student/mentors"
                        )
                    }
                >
                    <i className="bi bi-arrow-left me-2"></i> Back to Mentors
                </button>

            </div>

        );

    }


    if (!mentor) {

        return (

            <div className="container py-5">

                <div className="alert alert-warning">
                    Mentor profile not found.
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/student/mentors"
                        )
                    }
                >
                    <i className="bi bi-arrow-left me-2"></i> Back to Mentors
                </button>

            </div>

        );

    }


    // ======================================
    // UI
    // ======================================

    return (

        <div className="container py-5">

            {/* ==================================
                BACK BUTTON
            ================================== */}

            <button
                className="btn btn-link text-decoration-none px-0 mb-4"
                onClick={() =>
                    navigate(
                        "/student/mentors"
                    )
                }
            >
                <i className="bi bi-arrow-left me-2"></i> Back to Mentors
            </button>


            <div className="row justify-content-center">

                <div className="col-lg-9">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4 p-md-5">


                            {/* ==================================
                                PROFILE HEADER
                            ================================== */}

                            <div className="text-center mb-4">

                                <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        fontSize: "40px"
                                    }}
                                >
                                    {mentor.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>


                                <h1 className="fw-bold mb-1">
                                    {mentor.name}
                                </h1>


                                <p className="text-primary fw-semibold mb-2">
                                    {mentor.expertise}
                                </p>


                                <span
                                    className={
                                        getAvailabilityClass()
                                    }
                                >
                                    {mentor.availability}
                                </span>

                            </div>


                            <hr />


                            {/* ==================================
                                ABOUT
                            ================================== */}

                            <div className="py-3">

                                <h4 className="fw-bold mb-3">
                                    About the Mentor
                                </h4>

                                <p className="text-muted mb-0">
                                    {mentor.bio}
                                </p>

                            </div>


                            {/* ==================================
                                EXPERIENCE
                            ================================== */}

                            <div className="py-3">

                                <h4 className="fw-bold mb-3">
                                    Experience
                                </h4>

                                <p className="text-muted mb-0">
                                    {mentor.experience}
                                </p>

                            </div>


                            {/* ==================================
                                CONTACT
                            ================================== */}

                            <div className="py-3">

                                <h4 className="fw-bold mb-3">
                                    Contact Information
                                </h4>


                                <p className="text-muted mb-2">

                                    <strong>
                                        Email:
                                    </strong>{" "}

                                    {mentor.email}

                                </p>


                                {mentor.linkedin ? (

                                    <p className="mb-0">

                                        <strong>
                                            LinkedIn:
                                        </strong>{" "}

                                        <a
                                            href={
                                                mentor.linkedin
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-decoration-none"
                                        >
                                            View LinkedIn Profile
                                        </a>

                                    </p>

                                ) : (

                                    <p className="text-muted mb-0">
                                        LinkedIn profile not provided.
                                    </p>

                                )}

                            </div>


                            <hr />


                            {/* ==================================
                                REQUEST
                            ================================== */}

                            <div className="pt-3">

                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={() =>
                                        navigate(
                                            `/student/mentor/${mentor._id}/request`
                                        )
                                    }
                                >
                                    <i className="bi bi-send me-2"></i> Send Mentorship Request
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default MentorDetails;