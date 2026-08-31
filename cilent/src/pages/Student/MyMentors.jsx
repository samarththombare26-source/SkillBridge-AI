import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MyMentors() {

    const navigate = useNavigate();

    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        fetchMyMentors();

    }, []);


    const fetchMyMentors = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/mentor/my-mentors"
            );

            setMentors(
                response.data.mentors || []
            );

        } catch (error) {

            console.error(
                "My Mentors Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your mentors"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="container py-4 py-md-5">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3">
                        Loading your mentors...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="container py-4 py-md-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>

                    <h1 className="fw-bold">
                        My Mentors
                    </h1>

                    <p className="text-muted mb-0">
                        Mentors who have accepted your
                        mentorship requests.
                    </p>

                </div>


                <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                        navigate("/student/mentors")
                    }
                >
                    Find More Mentors
                </button>

            </div>


            {/* Error */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* No Mentors */}

            {!error &&
                mentors.length === 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                <i className="bi bi-person-workspace"></i>
                            </div>

                            <h4 className="fw-bold">
                                No Connected Mentors
                            </h4>

                            <p className="text-muted">
                                You don't have any connected
                                mentors yet.
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


            {/* Mentor Cards */}

            {!error &&
                mentors.length > 0 && (

                    <div className="row g-4">

                        {mentors.map((mentor) => (

                            <div
                                className="col-12 col-sm-6 col-lg-4"
                                key={mentor._id}
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        {/* Avatar */}

                                        <div
                                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                                            style={{
                                                width: "75px",
                                                height: "75px",
                                                fontSize: "30px"
                                            }}
                                        >
                                            {mentor.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>


                                        {/* Name */}

                                        <h5 className="fw-bold text-center">

                                            {mentor.name}

                                        </h5>


                                        {/* Expertise */}

                                        <p className="text-primary text-center mb-3">

                                            {mentor.expertise}

                                        </p>


                                        {/* Experience */}

                                        <div className="text-muted mb-2">

                                            <strong>
                                                Experience:
                                            </strong>{" "}

                                            {mentor.experience}

                                        </div>


                                        {/* Bio */}

                                        <p className="text-muted">

                                            {mentor.bio}

                                        </p>


                                        {/* Connected */}

                                        <div className="mb-3">

                                            <span className="badge text-bg-success">

                                                Connected

                                            </span>

                                        </div>

                                     <button
    className="btn btn-primary w-100 mb-2"
    onClick={async () => {

        try {

            console.log(
                "Mentor object:",
                mentor
            );

            console.log(
                "Mentor ID:",
                mentor._id
            );

            const response =
                await API.post(
                    "/conversations",
                    {
                        mentorId: mentor._id
                    }
                );

            console.log(
                "Conversation response:",
                response.data
            );

            navigate(
                `/student/conversation/${response.data.conversation._id}`
            );

        } catch (error) {

            console.error(
                "Create Conversation Error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to contact mentor"
            );

        }

    }}
>
    💬 Contact Mentor
</button>
                                        {/* LinkedIn */}

                                        {mentor.linkedin && (

                                            <a
                                                href={mentor.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-outline-primary w-100"
                                            >
                                                View LinkedIn
                                            </a>

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

export default MyMentors;