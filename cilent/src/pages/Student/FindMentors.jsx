import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function FindMentors() {

    const navigate = useNavigate();

    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ======================================
    // FETCH MENTORS
    // ======================================

    useEffect(() => {

        fetchMentors();

    }, []);


    const fetchMentors = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/mentor"
            );

            setMentors(
                response.data.mentors || []
            );

        } catch (error) {

            console.error(
                "Get Mentors Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load mentors"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // AVAILABILITY BADGE
    // ======================================

    const getAvailabilityClass = (availability) => {

        if (availability === "Available") {
            return "badge text-bg-success";
        }

        if (availability === "Busy") {
            return "badge text-bg-warning";
        }

        return "badge text-bg-secondary";

    };


    // ======================================
    // UI
    // ======================================

    return (

        <div className="container py-4 py-md-5">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="text-center mb-4 mb-md-5">

                <h1 className="fw-bold" style={{ fontSize: "clamp(1.5rem,4vw,2rem)" }}>
                    Find a Mentor
                </h1>

                <p className="text-muted mb-0">
                    Connect with experienced mentors
                    and get guidance for your career.
                </p>

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="mt-3 text-muted">
                        Loading mentors...
                    </p>

                </div>

            )}


            {/* ==================================
                ERROR
            ================================== */}

            {!loading && error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* ==================================
                NO MENTORS
            ================================== */}

            {!loading &&
                !error &&
                mentors.length === 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                <i className="bi bi-person-workspace"></i>
                            </div>

                            <h4 className="fw-bold">
                                No Mentors Available
                            </h4>

                            <p className="text-muted mb-0">
                                Mentor profiles will appear here
                                once mentors create their profiles.
                            </p>

                        </div>

                    </div>

                )}


            {/* ==================================
                MENTOR CARDS
            ================================== */}

            {!loading &&
                !error &&
                mentors.length > 0 && (

                    <div className="row g-3 g-md-4">

                        {mentors.map((mentor) => (

                            <div
                                className="col-12 col-sm-6 col-lg-4"
                                key={mentor._id}
                            >

                                <div className="card h-100 border-0 shadow-sm">

                                    <div className="card-body p-3 p-md-4 d-flex flex-column">


                                        {/* ==============================
                                            AVATAR
                                        ============================== */}

                                        <div className="text-center mb-3">

                                            <div
                                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    fontSize: "30px"
                                                }}
                                            >

                                                {mentor.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                        </div>


                                        {/* ==============================
                                            NAME
                                        ============================== */}

                                        <h4 className="fw-bold text-center mb-1">

                                            {mentor.name}

                                        </h4>


                                        {/* ==============================
                                            EXPERTISE
                                        ============================== */}

                                        <p className="text-primary fw-semibold text-center mb-3">

                                            {mentor.expertise}

                                        </p>


                                        {/* ==============================
                                            AVAILABILITY
                                        ============================== */}

                                        <div className="text-center mb-3">

                                            <span
                                                className={getAvailabilityClass(
                                                    mentor.availability
                                                )}
                                            >
                                                {mentor.availability}
                                            </span>

                                        </div>


                                        {/* ==============================
                                            EXPERIENCE
                                        ============================== */}

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Experience
                                            </small>

                                            <p className="fw-semibold mb-0">

                                                {mentor.experience}

                                            </p>

                                        </div>


                                        {/* ==============================
                                            BIO
                                        ============================== */}

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                About
                                            </small>

                                            <p
                                                className="text-muted mb-0"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                {mentor.bio}
                                            </p>

                                        </div>


                                        {/* ==============================
                                            LINKEDIN
                                        ============================== */}

                                        {mentor.linkedin && (

                                            <div className="mb-3">

                                                <a
                                                    href={mentor.linkedin}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-decoration-none"
                                                >
                                                    🔗 LinkedIn Profile
                                                </a>

                                            </div>

                                        )}


                                        {/* ==============================
                                            BUTTON
                                        ============================== */}

                                        <div className="mt-auto">

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    navigate(
                                                        `/student/mentor/${mentor._id}`
                                                    )
                                                }
                                            >
                                                View Mentor Profile
                                            </button>

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

export default FindMentors;