import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

function CareerRoadmaps() {

    const navigate = useNavigate();

    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        getRoadmaps();

    }, []);


    // ======================================
    // GET ROADMAPS
    // ======================================

    const getRoadmaps = async () => {

        try {

            const response =
                await API.get("/career-roadmaps");

            setRoadmaps(
                response.data.roadmaps || []
            );

        } catch (error) {

            console.log(
                "Roadmap Error:",
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

            <div className="container py-5 text-center">

                <h4>
                    Loading career roadmaps...
                </h4>

            </div>

        );

    }


    return (

        <div className="container py-4 py-md-5">

            {/* HEADER */}

            <div className="text-center mb-4 mb-md-5">

                <h1 className="fw-bold" style={{ fontSize: "clamp(1.4rem,4vw,2rem)" }}>

                    <i className="bi bi-rocket-takeoff me-2"></i> Career Roadmaps

                </h1>

                <p className="text-muted">

                    Choose your career path and follow
                    a step-by-step roadmap.

                </p>

            </div>


            {/* NO ROADMAP */}

            {roadmaps.length === 0 ? (

                <div className="alert alert-info text-center">

                    No career roadmaps available yet.

                </div>

            ) : (

                <div className="row g-3 g-md-4">

                    {roadmaps.map((roadmap) => (

                        <div
                            className="col-12 col-sm-6 col-lg-4"
                            key={roadmap._id}
                        >

                            <div
                                className="card shadow-sm h-100"
                            >

                                <div className="card-body">

                                    <span className="badge bg-primary mb-3">

                                        {roadmap.category}

                                    </span>


                                    <h4 className="fw-bold">

                                        {roadmap.title}

                                    </h4>


                                    <p className="text-muted">

                                        {roadmap.description}

                                    </p>


                                    <p>

                                        <strong>
                                            Level:
                                        </strong>{" "}

                                        {roadmap.level}

                                    </p>


                                    <p>

                                        <strong>
                                            Skills:
                                        </strong>

                                    </p>


                                    <div className="mb-3">

                                        {roadmap.skills?.map(
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


                                    <p>

                                        <strong>
                                            Roadmap Steps:
                                        </strong>{" "}

                                        {roadmap.steps?.length || 0}

                                    </p>


                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() =>
                                            navigate(
                                                `/career-roadmaps/${roadmap._id}`
                                            )
                                        }
                                    >

                                        View Roadmap <i className="bi bi-arrow-right ms-2"></i>

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CareerRoadmaps;