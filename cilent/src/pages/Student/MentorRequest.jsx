import { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import API from "../../api/axiosInstance";

function MentorRequest() {

    const { mentorId } = useParams();

    const navigate = useNavigate();

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSuccess("");
        setError("");

        if (!message.trim()) {

            setError(
                "Please enter a message before sending the request."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/mentor/request",
                {
                    mentorId,
                    message
                }
            );

            setSuccess(
                response.data.message
            );

            setMessage("");

            setTimeout(() => {

                navigate("/student/mentor-requests");

            }, 1500);

        } catch (error) {

            console.error(
                "Mentor Request Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to send mentorship request"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-7">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4 p-md-5">

                            {/* Header */}

                            <div className="mb-4">

                                <h2 className="fw-bold">
                                    Send Mentorship Request
                                </h2>

                                <p className="text-muted">
                                    Introduce yourself and explain
                                    what you would like help with.
                                </p>

                            </div>


                            {/* Success */}

                            {success && (

                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >
                                    {success}
                                </div>

                            )}


                            {/* Error */}

                            {error && (

                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>

                            )}


                            <form
                                onSubmit={handleSubmit}
                            >

                                {/* Message */}

                                <div className="mb-4">

                                    <label
                                        className="form-label fw-semibold"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="7"
                                        placeholder="Write a message to the mentor..."
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <div className="form-text">
                                        Explain what you want
                                        guidance with.
                                    </div>

                                </div>


                                {/* Buttons */}

                                <div className="d-flex gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(
                                                `/student/mentor/${mentorId}`
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Sending..."
                                            : "Send Request"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MentorRequest;