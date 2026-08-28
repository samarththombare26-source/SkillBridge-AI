import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axiosInstance";

function CareerRoadmapDetails() {

    const { roadmapId } = useParams();

    const navigate = useNavigate();

    const [roadmap, setRoadmap] = useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        getRoadmap();

    }, [roadmapId]);


    // ======================================
    // GET ROADMAP
    // ======================================

    const getRoadmap = async () => {

        try {

            const response =
                await API.get(
                    `/career-roadmaps/${roadmapId}`
                );

            setRoadmap(
                response.data.roadmap
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


    if (loading) {

        return (

            <div className="container py-5 text-center">

                <h4>
                    Loading roadmap...
                </h4>

            </div>

        );

    }


    if (!roadmap) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    Career roadmap not found.

                </div>


                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/career-roadmaps")
                    }
                >

                    <i className="bi bi-arrow-left me-2"></i> Back to Roadmaps

                </button>

            </div>

        );

    }


    return (

        <div className="container py-5">

            {/* BACK BUTTON */}

            <button
                className="btn btn-secondary mb-4"
                onClick={() =>
                    navigate("/career-roadmaps")
                }
            >

                <i className="bi bi-arrow-left me-2"></i> Back to Roadmaps

            </button>


            {/* HEADER */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <span className="badge bg-primary mb-3">

                        {roadmap.category}

                    </span>


                    <h1 className="fw-bold">

                        {roadmap.title}

                    </h1>


                    <p className="text-muted">

                        {roadmap.description}

                    </p>


                    <p>

                        <strong>
                            Level:
                        </strong>{" "}

                        {roadmap.level}

                    </p>


                    <h5 className="mt-4">

                        Required Skills

                    </h5>


                    <div>

                        {roadmap.skills?.map(
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

                </div>

            </div>


            {/* ROADMAP STEPS */}

            <h2 className="fw-bold mb-4">

                <i className="bi bi-signpost-2 me-2"></i> Roadmap

            </h2>


            {roadmap.steps?.map(
                (step, index) => (

                    <div
                        className="card shadow-sm mb-3"
                        key={index}
                    >

                        <div className="card-body">

                            <div className="d-flex">

                                <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        minWidth: "45px",
                                        height: "45px"
                                    }}
                                >

                                    {index + 1}

                                </div>


                                <div>

                                    <h5 className="fw-bold">

                                        {step.title}

                                    </h5>


                                    <p className="text-muted">

                                        {step.description}

                                    </p>


                                    <span className="badge bg-secondary">

                                        ⏱ {step.duration}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            )}


            {/* RESOURCES */}

            {roadmap.resources?.length > 0 && (

                <div className="card shadow-sm mt-4">

                    <div className="card-body">

                        <h4 className="fw-bold">

                            📚 Resources

                        </h4>


                        <ul>

                            {roadmap.resources.map(
                                (resource, index) => (

                                    <li key={index}>

                                        {resource}

                                    </li>

                                )
                            )}

                        </ul>

                    </div>

                </div>

            )}

        </div>

    );

}

export default CareerRoadmapDetails;