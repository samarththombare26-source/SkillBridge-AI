import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function InternshipDetails() {

    const { internshipId } = useParams();
    const navigate = useNavigate();

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);


    // ======================================
    // GET INTERNSHIP
    // ======================================

    useEffect(() => {

        getInternship();

    }, [internshipId]);


    const getInternship = async () => {

        try {

            const response = await API.get(
                `/internships/${internshipId}`
            );

            setInternship(
                response.data.internship
            );

        } catch (error) {

            console.log(
                "Internship Details Error:",
                error.response?.data ||
                error.message
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
            <div className="container mt-5">
                <h4>Loading internship...</h4>
            </div>
        );

    }


    // ======================================
    // NOT FOUND
    // ======================================

    if (!internship) {

        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    Internship not found.
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/student/internships")
                    }
                >
                    <i className="bi bi-arrow-left me-2"></i> Back to Internships
                </button>

            </div>
        );

    }

    const handleApply = async () => {

        try {

            const response = await API.post(
                "/internship-applications/apply",
                {
                    internshipId: internship._id,
                    coverLetter: ""
                }
            );

            alert(response.data.message);

            navigate("/student/my-applications");

        } catch (error) {

            console.log(
                "Application Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to apply for internship"
            );

        }

    };

    return (

        <div className="container py-5">

            {/* BACK BUTTON */}

            <button
                className="btn btn-secondary mb-4"
                onClick={() =>
                    navigate("/student/internships")
                }
            >
                <i className="bi bi-arrow-left me-2"></i> Back to Internships
            </button>


            {/* INTERNSHIP DETAILS */}

            <div className="card shadow">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between">

                        <h2>
                            {internship.title}
                        </h2>

                        <span className="badge bg-success align-self-start">
                            {internship.status}
                        </span>

                    </div>


                    <h4 className="text-primary mt-2">
                        {internship.company}
                    </h4>


                    <hr />


                    <h5>
                        About the Internship
                    </h5>

                    <p>
                        {internship.description}
                    </p>


                    <div className="row mt-4">

                        <div className="col-md-6">

                            <p>
                                <strong>
                                    📍 Location:
                                </strong>{" "}
                                {internship.location}
                            </p>

                            <p>
                                <strong>
                                    ⏱ Duration:
                                </strong>{" "}
                                {internship.duration}
                            </p>

                            <p>
                                <strong>
                                    💰 Stipend:
                                </strong>{" "}
                                {internship.stipend || "Not specified"}
                            </p>

                        </div>


                        <div className="col-md-6">

                            <p>
                                <strong>
                                    💼 Type:
                                </strong>{" "}
                                {internship.type}
                            </p>

                            <p>
                                <strong>
                                    📅 Application Deadline:
                                </strong>{" "}
                                {new Date(
                                    internship.deadline
                                ).toLocaleDateString()}
                            </p>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <h5 className="mt-4">
                        Required Skills
                    </h5>

                    <div className="mb-4">

                        {internship.skills?.map(
                            (skill, index) => (

                                <span
                                    key={index}
                                    className="badge bg-light text-dark me-2 mb-2"
                                >
                                    {skill}
                                </span>

                            )
                        )}

                    </div>


                    {/* APPLY BUTTON */}

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleApply}
                    >
                        Apply for Internship <i className="bi bi-arrow-right ms-2"></i>
                    </button>

                </div>

            </div>

        </div>

    );

}

export default InternshipDetails;