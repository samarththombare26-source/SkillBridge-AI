import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        getApplications();

    }, []);


    const getApplications = async () => {

        try {

            const response = await API.get(
                "/internship-applications/my-applications"
            );

            setApplications(
                response.data.applications || []
            );

        } catch (error) {

            console.log(
                "Applications Error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="container py-4 py-md-5">
                <h4>Loading applications...</h4>
            </div>
        );

    }


    return (

        <div className="container py-4 py-md-5">

            <button
                className="btn btn-secondary mb-4"
                onClick={() =>
                    navigate("/student/internships")
                }
            >
                <i className="bi bi-arrow-left me-2"></i> Back to Internships
            </button>


            <h2>
                My Internship Applications
            </h2>

            <p className="text-muted">
                Track the status of your internship applications.
            </p>


            {applications.length === 0 ? (

                <div className="alert alert-info mt-4">

                    You have not applied for any internships yet.

                </div>

            ) : (

                <div className="row g-3 mt-4">

                    {applications.map((application) => (

                        <div
                            className="col-12 col-md-6"
                            key={application._id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body">

                                    <h4>
                                        {application.internship?.title}
                                    </h4>

                                    <h6 className="text-primary">
                                        {application.internship?.company}
                                    </h6>

                                    <p className="mt-3">

                                        <strong>
                                            Location:
                                        </strong>{" "}

                                        {application.internship?.location}

                                    </p>


                                    <p>

                                        <strong>
                                            Applied On:
                                        </strong>{" "}

                                        {new Date(
                                            application.createdAt
                                        ).toLocaleDateString()}

                                    </p>


                                    <p>

                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        <span
                                            className={
                                                application.status === "Accepted"
                                                    ? "badge bg-success"
                                                    : application.status === "Rejected"
                                                        ? "badge bg-danger"
                                                        : "badge bg-warning text-dark"
                                            }
                                        >
                                            {application.status}
                                        </span>

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyApplications;