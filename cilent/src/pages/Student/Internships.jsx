import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { isSaved, toggleSave } from "../../utils/bookmark";

function Internships() {

    const navigate = useNavigate();

    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, forceUpdate] = useState(0);


    // ======================================
    // GET INTERNSHIPS
    // ======================================

    useEffect(() => {

        getInternships();

    }, []);


    const getInternships = async () => {

        try {

            const response = await API.get(
                "/internships"
            );

            setInternships(
                response.data.internships || []
            );

        } catch (error) {

            console.log(
                "Internships Error:",
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
                <h4>Loading internships...</h4>
            </div>
        );

    }


    return (

        <div className="container py-4 py-md-5">

            <div className="mb-4 text-center text-md-start">

                <h2 className="fw-bold" style={{ fontSize: "clamp(1.4rem,3vw,1.75rem)" }}>
                    Internship Opportunities
                </h2>

                <p className="text-muted mb-0">
                    Explore internships and find the
                    right opportunity for you.
                </p>

            </div>


            {internships.length === 0 ? (

                <div className="alert alert-info">
                    No internships available right now.
                </div>

            ) : (

                <div className="row g-3 g-md-4">

                    {internships.map((internship) => (

                        <div
                            className="col-12 col-sm-6 col-lg-4"
                            key={internship._id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-start">

                                        <h5 className="card-title">
                                            {internship.title}
                                        </h5>

                                        <span className="badge bg-success">
                                            {internship.status}
                                        </span>

                                    </div>


                                    <h6 className="text-primary mt-2">
                                        {internship.company}
                                    </h6>


                                    <p className="card-text mt-3 text-clamp-3" style={{ fontSize: "0.92rem" }}>
                                        {internship.description}
                                    </p>


                                    <p className="mb-2">
                                        <strong>
                                            <i className="bi bi-geo-alt me-1"></i> Location:
                                        </strong>{" "}
                                        {internship.location}
                                    </p>


                                    <p className="mb-2">
                                        <strong>
                                            <i className="bi bi-clock me-1"></i> Duration:
                                        </strong>{" "}
                                        {internship.duration}
                                    </p>


                                    <p className="mb-2">
                                        <strong>
                                            <i className="bi bi-currency-rupee me-1"></i> Stipend:
                                        </strong>{" "}
                                        {internship.stipend}
                                    </p>


                                    <p className="mb-3">
                                        <strong>
                                            <i className="bi bi-calendar-event me-1"></i> Deadline:
                                        </strong>{" "}
                                        {new Date(
                                            internship.deadline
                                        ).toLocaleDateString()}
                                    </p>


                                    <div className="mb-3">

                                        {internship.skills?.map(
                                            (skill, index) => (

                                                <span
                                                    key={index}
                                                    className="badge bg-light text-dark me-1 mb-1"
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )}

                                    </div>


                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            className="btn btn-primary flex-fill"
                                            onClick={() =>
                                                navigate(
                                                    `/student/internship/${internship._id}`
                                                )
                                            }
                                        >
                                            View Internship
                                        </button>
                                        <button
                                            className={`btn flex-shrink-0 ${isSaved("internships", internship._id) ? "btn-warning" : "btn-outline-secondary"}`}
                                            onClick={() => { toggleSave("internships", internship); forceUpdate((x) => x + 1); }}
                                            title={isSaved("internships", internship._id) ? "Saved" : "Save"}
                                        >
                                            <i className={`bi ${isSaved("internships", internship._id) ? "bi-bookmark-heart-fill" : "bi-bookmark-heart"}`}></i>
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

export default Internships;